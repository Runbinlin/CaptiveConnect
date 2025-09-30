# 🎮 FatThin - 胖瘦双雄游戏

一个基于 Bevy 引擎开发的双人对战游戏，展现胖子和瘦子截然不同的游戏机制和策略玩法。

## 🎯 游戏特色

### 双角色机制
- **🔴 胖子（Fat）**：血厚速慢，近战高伤
- **🔵 瘦子（Thin）**：血薄速快，远程灵活

### 技能系统
- 收集 XP 球达到 100 点激活专属技能
- **胖子技能**：移动速度翻倍
- **瘦子技能**：射程增强 50%

## 🕹️ 操作方式

| 角色 | 移动 | 攻击 | 特点 |
|------|------|------|------|
| 🔴 胖子 | WASD | 空格键 | 近战范围攻击，血量 200 |
| 🔵 瘦子 | 方向键 | 回车键 | 远程子弹攻击，血量 100 |

## 🚀 快速开始

### 环境要求
- Rust 1.70+
- Cargo

### 运行游戏
```bash
# 克隆项目
git clone https://github.com/yourusername/fathin.git
cd fathin

# 运行游戏
cargo run
```

### 开发模式
```bash
# 监听文件变化自动重编译
cargo install cargo-watch
cargo watch -x run
```

## 🎮 游戏玩法

1. **移动**：使用对应按键控制角色移动
2. **攻击**：
   - 胖子：空格键进行近战范围攻击
   - 瘦子：回车键发射远程子弹
3. **收集 XP**：靠近金色 XP 球自动拾取
4. **技能激活**：XP 达到 100 自动激活角色专属技能

## 🛠️ 技术栈

- **游戏引擎**：[Bevy 0.14](https://bevyengine.org/)
- **编程语言**：Rust
- **架构模式**：ECS (Entity Component System)

## 📁 项目结构

```
fathin/
├── Cargo.toml          # 项目配置
├── src/
│   └── main.rs         # 主程序文件
├── docs/               # 文档目录
│   └── development.md  # 开发日志
└── README.md           # 项目说明
```

## 🔮 后续开发计划

### 短期目标
- [ ] 添加敌人 AI 系统
- [ ] 实现真实鼠标瞄准
- [ ] 设计图形化 UI 界面
- [ ] 添加音效和背景音乐

### 中期目标
- [ ] 武器拾取系统
- [ ] 地图边界和障碍物
- [ ] 更多技能和升级树
- [ ] 存档系统

### 长期目标
- [ ] 联网对战功能
- [ ] 关卡编辑器
- [ ] 移动端适配
- [ ] Steam 发布

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 开源协议

本项目采用 MIT 或 Apache-2.0 双重许可证。详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- [Bevy Engine](https://bevyengine.org/) - 优秀的 Rust 游戏引擎
- Rust 社区的支持和贡献

---

**享受游戏，享受编程！** 🎮✨