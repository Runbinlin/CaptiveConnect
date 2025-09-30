package com.captiveconnect.app

import android.app.Application
import com.captiveconnect.service.HotspotService

class CaptiveConnectApp : Application() {
    lateinit var hotspotService: HotspotService
        private set
    
    override fun onCreate() {
        super.onCreate()
        hotspotService = HotspotService(this)
    }
}