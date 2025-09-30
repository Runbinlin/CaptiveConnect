package com.captiveconnect.ui

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.captiveconnect.app.CaptiveConnectApp
import com.captiveconnect.service.HotspotService

class MainActivity : AppCompatActivity() {
    private lateinit var hotspotService: HotspotService

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        hotspotService = (application as CaptiveConnectApp).hotspotService
    }
}