package com.captiveconnect.app
import android.app.Application
import android.content.Intent
import com.captiveconnect.service.HotspotService

class CaptiveConnectApp : Application() {
    override fun onCreate() {
        super.onCreate()
        startService(Intent(this, HotspotService::class.java).apply {
            action = HotspotService.ACTION_START
        })
    }
}