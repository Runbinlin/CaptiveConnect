package com.captiveconnect.ui
import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import androidx.appcompat.app.AppCompatActivity
import com.captiveconnect.service.HotspotService

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.System.canWrite(this)) {
            startActivity(Intent(Settings.ACTION_MANAGE_WRITE_SETTINGS).apply {
                data = android.net.Uri.parse("package:$packageName")
            })
        }
    }

    override fun onResume() {
        super.onResume()
        restartHotspotService()
    }

    private fun restartHotspotService() {
        Intent(this, HotspotService::class.java).also {
            it.action = HotspotService.ACTION_STOP
            startService(it)
            it.action = HotspotService.ACTION_START
            startService(it)
        }
    }
}