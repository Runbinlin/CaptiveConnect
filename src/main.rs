use bevy::prelude::*;

// ========== 游戏常量 ==========
const PLAYER_SPEED_FAT: f32 = 150.0;
const PLAYER_SPEED_THIN: f32 = 300.0;
const MAX_HEALTH_FAT: f32 = 200.0;
const MAX_HEALTH_THIN: f32 = 100.0;
const WEAPON_RANGE_THIN: f32 = 300.0;
const WEAPON_RANGE_FAT: f32 = 60.0;
const XP_TO_LEVEL: f32 = 100.0;
const BULLET_SPEED: f32 = 500.0;
const XP_COLLECT_DISTANCE: f32 = 30.0;

// ========== 组件定义 ==========
#[derive(Component)]
struct Player {
    player_type: PlayerType,
    health: f32,
    max_health: f32,
    speed: f32,
    xp: f32,
    skill_active: bool,
}

#[derive(Component)]
struct Weapon;

#[derive(Component)]
struct Bullet {
    damage: f32,
    lifetime: f32,
}

#[derive(Component)]
struct XpOrb {
    amount: f32,
}

#[derive(Component)]
struct Velocity(Vec3);

#[derive(Debug, Clone, Copy, PartialEq)]
enum PlayerType {
    Fat,
    Thin,
}

// ========== 游戏状态 ==========
#[derive(States, Debug, Clone, PartialEq, Eq, Hash, Default)]
enum GameState {
    #[default]
    Menu,
    Playing,
    Paused,
}

// ========== 主函数 ==========
fn main() {
    App::new()
        .add_plugins(DefaultPlugins.set(ImagePlugin::default_nearest()))
        .init_state::<GameState>()
        .add_systems(Startup, setup)
        .add_systems(
            Update,
            (
                handle_input,
                move_bullets,
                update_bullets,
                apply_xp_skills,
                collect_xp,
                update_ui,
            ).run_if(in_state(GameState::Playing)),
        )
        .run();
}

// ========== 初始化系统 ==========
fn setup(mut commands: Commands, mut next_state: ResMut<NextState<GameState>>) {
    // 创建摄像机
    commands.spawn(Camera2dBundle::default());

    // 创建胖子玩家（红色，WASD 控制）
    spawn_player(
        &mut commands,
        PlayerType::Fat,
        Vec3::new(-200.0, 0.0, 0.0),
        Color::srgb(0.8, 0.2, 0.2), // 深红色
    );

    // 创建瘦子玩家（蓝色，方向键控制）
    spawn_player(
        &mut commands,
        PlayerType::Thin,
        Vec3::new(200.0, 0.0, 0.0),
        Color::srgb(0.2, 0.2, 0.8), // 深蓝色
    );

    // 生成测试用的 XP 球
    for i in 0..5 {
        let x = (i as f32 - 2.0) * 100.0;
        commands.spawn((
            SpriteBundle {
                sprite: Sprite {
                    color: Color::srgb(1.0, 0.8, 0.0), // 金色
                    custom_size: Some(Vec2::new(15.0, 15.0)),
                    ..default()
                },
                transform: Transform::from_xyz(x, -100.0, 0.0),
                ..default()
            },
            XpOrb { amount: 30.0 },
        ));
    }

    // 切换到游戏状态
    next_state.set(GameState::Playing);
    
    println!("🎮 游戏开始！");
    println!("🔴 胖子（红色）：WASD 移动，空格键近战攻击");
    println!("🔵 瘦子（蓝色）：方向键移动，回车键远程攻击");
    println!("💰 收集金色 XP 球，满 100 XP 激活技能！");
}

fn spawn_player(
    commands: &mut Commands,
    player_type: PlayerType,
    position: Vec3,
    color: Color,
) {
    let (max_health, speed) = match player_type {
        PlayerType::Fat => (MAX_HEALTH_FAT, PLAYER_SPEED_FAT),
        PlayerType::Thin => (MAX_HEALTH_THIN, PLAYER_SPEED_THIN),
    };

    commands.spawn((
        SpriteBundle {
            sprite: Sprite {
                color,
                custom_size: Some(Vec2::new(40.0, 40.0)),
                ..default()
            },
            transform: Transform::from_translation(position),
            ..default()
        },
        Player {
            player_type,
            health: max_health,
            max_health,
            speed,
            xp: 0.0,
            skill_active: false,
        },
    ));
}

// ========== 输入处理系统 ==========
fn handle_input(
    keyboard: Res<ButtonInput<KeyCode>>,
    mut players: Query<(&mut Transform, &Player), With<Player>>,
    mut commands: Commands,
    time: Res<Time>,
) {
    for (mut transform, player) in &mut players {
        let mut direction = Vec3::ZERO;

        // 胖子控制（WASD）
        if player.player_type == PlayerType::Fat {
            if keyboard.pressed(KeyCode::KeyA) {
                direction.x -= 1.0;
            }
            if keyboard.pressed(KeyCode::KeyD) {
                direction.x += 1.0;
            }
            if keyboard.pressed(KeyCode::KeyW) {
                direction.y += 1.0;
            }
            if keyboard.pressed(KeyCode::KeyS) {
                direction.y -= 1.0;
            }
            // 近战攻击
            if keyboard.just_pressed(KeyCode::Space) {
                shoot_weapon(&mut commands, transform.translation, player, true);
            }
        }
        // 瘦子控制（方向键）
        else if player.player_type == PlayerType::Thin {
            if keyboard.pressed(KeyCode::ArrowLeft) {
                direction.x -= 1.0;
            }
            if keyboard.pressed(KeyCode::ArrowRight) {
                direction.x += 1.0;
            }
            if keyboard.pressed(KeyCode::ArrowUp) {
                direction.y += 1.0;
            }
            if keyboard.pressed(KeyCode::ArrowDown) {
                direction.y -= 1.0;
            }
            // 远程攻击
            if keyboard.just_pressed(KeyCode::Enter) {
                shoot_weapon(&mut commands, transform.translation, player, false);
            }
        }

        // 移动处理
        if direction.length() > 0.0 {
            direction = direction.normalize();
            let effective_speed = if player.skill_active && player.player_type == PlayerType::Fat {
                player.speed * 2.0 // 胖子技能：移动加速
            } else {
                player.speed
            };
            transform.translation += direction * effective_speed * time.delta_seconds();
        }
    }
}

// ========== 武器系统 ==========
fn shoot_weapon(
    commands: &mut Commands,
    pos: Vec3,
    player: &Player,
    is_fat: bool,
) {
    if is_fat {
        // 胖子：近战攻击（瞬间伤害区域）
        commands.spawn((
            SpriteBundle {
                sprite: Sprite {
                    color: Color::srgb(1.0, 0.5, 0.0), // 橙色攻击效果
                    custom_size: Some(Vec2::new(80.0, 80.0)),
                    ..default()
                },
                transform: Transform::from_translation(pos),
                ..default()
            },
            Bullet {
                damage: 25.0,
                lifetime: 0.2, // 短暂显示
            },
        ));
        println!("🔴 胖子近战攻击！");
    } else {
        // 瘦子：远程子弹（向上发射，后续可改为鼠标方向）
        let direction = Vec3::new(0.0, 1.0, 0.0);
        let enhanced_range = if player.skill_active { 1.5 } else { 1.0 };
        
        commands.spawn((
            SpriteBundle {
                sprite: Sprite {
                    color: Color::srgb(0.8, 0.8, 1.0), // 淡蓝色子弹
                    custom_size: Some(Vec2::new(8.0, 8.0)),
                    ..default()
                },
                transform: Transform::from_translation(pos),
                ..default()
            },
            Bullet {
                damage: 15.0,
                lifetime: 3.0 * enhanced_range, // 技能增加射程
            },
            Velocity(direction * BULLET_SPEED),
        ));
        println!("🔵 瘦子远程射击！");
    }
}

// ========== 子弹系统 ==========
fn move_bullets(
    mut bullets: Query<(&mut Transform, &Velocity), With<Bullet>>,
    time: Res<Time>,
) {
    for (mut transform, velocity) in &mut bullets {
        transform.translation += velocity.0 * time.delta_seconds();
    }
}

fn update_bullets(
    mut commands: Commands,
    mut bullets: Query<(Entity, &mut Bullet)>,
    time: Res<Time>,
) {
    for (entity, mut bullet) in &mut bullets {
        bullet.lifetime -= time.delta_seconds();
        if bullet.lifetime <= 0.0 {
            commands.entity(entity).despawn();
        }
    }
}

// ========== XP 和技能系统 ==========
fn apply_xp_skills(mut players: Query<&mut Player>) {
    for mut player in &mut players {
        if player.xp >= XP_TO_LEVEL && !player.skill_active {
            player.skill_active = true;
            match player.player_type {
                PlayerType::Fat => println!("🔴 胖子激活技能：移动速度翻倍！"),
                PlayerType::Thin => println!("🔵 瘦子激活技能：射程增强！"),
            }
        }
    }
}

fn collect_xp(
    mut players: Query<(&Transform, &mut Player)>,
    xp_orbs: Query<(Entity, &Transform, &XpOrb), With<XpOrb>>,
    mut commands: Commands,
) {
    for (player_transform, mut player) in &mut players {
        for (orb_entity, orb_transform, xp_orb) in &xp_orbs {
            let distance = player_transform
                .translation
                .distance(orb_transform.translation);
            
            if distance < XP_COLLECT_DISTANCE {
                player.xp += xp_orb.amount;
                commands.entity(orb_entity).despawn();
                println!(
                    "{:?} 获得 {} XP！当前 XP: {:.0}/{}",
                    player.player_type, xp_orb.amount, player.xp, XP_TO_LEVEL
                );
            }
        }
    }
}

// ========== UI 系统 ==========
fn update_ui(players: Query<&Player>) {
    // 简化的控制台 UI，后续可扩展为图形界面
    for player in &players {
        if player.xp as i32 % 50 == 0 && player.xp > 0.0 { // 减少输出频率
            println!(
                "{:?} 状态 - 血量: {:.0}/{:.0}, 经验: {:.0}/{}, 技能: {}",
                player.player_type,
                player.health,
                player.max_health,
                player.xp,
                XP_TO_LEVEL,
                if player.skill_active { "已激活" } else { "未激活" }
            );
        }
    }
}