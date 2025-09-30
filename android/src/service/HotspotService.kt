package com.captiveconnect.service
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.net.wifi.WifiConfiguration
import android.net.wifi.WifiManager
import android.os.Build
import android.os.IBinder
import android.os.PowerManager
import android.util.Log
import androidx.core.app.NotificationCompat
import com.captiveconnect.R
import com.captiveconnect.ui.MainActivity

class HotspotService : Service() {
    private var wakeLock: PowerManager.WakeLock? = null
    private val wifiManager by lazy { applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager }

    companion object {
        const val CHANNEL_ID = "HotspotServiceChannel"
        const val NOTIFICATION_ID = 1
        const val ACTION_START = "com.captiveconnect.START_HOTSPOT"
        const val ACTION_STOP = "com.captiveconnect.STOP_HOTSPOT"
        private const val DEFAULT_SSID = "CaptiveConnect"
        private const val TAG = "HotspotService"
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_START -> {
                startHotspotService()
                createHotspot(DEFAULT_SSID)
            }
            ACTION_STOP -> {
                stopHotspot()
                stopForeground(true)
                stopSelf()
            }
        }
        return START_NOT_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun startHotspotService() {
        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("CaptiveConnect")
            .setContentText("Running")
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentIntent(getPendingIntent())
            .setOngoing(true)
            .build()
        startForeground(NOTIFICATION_ID, notification)
        acquireWakeLock()
    }

    private fun createHotspot(ssid: String): Boolean = try {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val config = WifiConfiguration().apply {
                this.SSID = ssid
                allowedKeyManagement.set(WifiConfiguration.KeyMgmt.NONE)
            }
            wifiManager.javaClass.getMethod("startSoftAp", WifiConfiguration::class.java)
                .invoke(wifiManager, config) as Boolean
        } else {
            val config = WifiConfiguration().apply {
                this.SSID = ssid
                allowedKeyManagement.set(WifiConfiguration.KeyMgmt.NONE)
            }
            wifiManager.javaClass.getMethod(
                "setWifiApEnabled",
                WifiConfiguration::class.java,
                Boolean::class.java
            ).invoke(wifiManager, config, true) as Boolean
        }.also { Log.d(TAG, "Hotspot created: $it") }
    } catch (e: Exception) {
        Log.e(TAG, "Hotspot error", e)
        false
    }

    private fun stopHotspot() = try {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            wifiManager.javaClass.getMethod("stopSoftAp").invoke(wifiManager)
        } else {
            wifiManager.javaClass.getMethod(
                "setWifiApEnabled",
                WifiConfiguration::class.java,
                Boolean::class.java
            ).invoke(wifiManager, null, false)
        }
    } catch (e: Exception) {
        Log.e(TAG, "Stop error", e)
    } finally {
        releaseWakeLock()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel(CHANNEL_ID, "Hotspot", NotificationManager.IMPORTANCE_LOW)
                .apply {
                    description = "Keep running"
                    getSystemService(NotificationManager::class.java)?.createNotificationChannel(this)
                }
        }
    }

    private fun getPendingIntent() = PendingIntent.getActivity(
        this, 0, Intent(this, MainActivity::class.java),
        PendingIntent.FLAG_IMMUTABLE
    )

    private fun acquireWakeLock() {
        wakeLock = (getSystemService(Context.POWER_SERVICE) as PowerManager).run {
            newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "CaptiveConnect:lock").apply {
                acquire(10*60*1000L)
            }
        }
    }

    private fun releaseWakeLock() {
        wakeLock?.let { if (it.isHeld) it.release() }
        wakeLock = null
    }
}