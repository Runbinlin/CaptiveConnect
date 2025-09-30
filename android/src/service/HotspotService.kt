package com.captiveconnect.service

import android.content.Context
import android.net.wifi.WifiConfiguration
import android.net.wifi.WifiManager
import android.os.Build
import android.util.Log

/**
 * Service class for managing WiFi hotspot operations
 */
class HotspotService(private val context: Context) {
    private val wifiManager = context.getSystemService(Context.WIFI_SERVICE) as WifiManager
    
    fun createHotspot(ssid: String): Boolean {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val method = wifiManager.javaClass.getMethod(
                    "startSoftAp", WifiConfiguration::class.java
                )
                
                val config = WifiConfiguration()
                config.SSID = ssid
                config.allowedKeyManagement.set(WifiConfiguration.KeyMgmt.NONE)
                
                return method.invoke(wifiManager, config) as Boolean
            } else {
                val config = WifiConfiguration()
                config.SSID = ssid
                config.allowedKeyManagement.set(WifiConfiguration.KeyMgmt.NONE)
                
                val method = wifiManager.javaClass.getMethod(
                    "setWifiApEnabled", WifiConfiguration::class.java, Boolean::class.java
                )
                method.invoke(wifiManager, config, true)
                return true
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error creating hotspot", e)
            return false
        }
    }
    
    fun stopHotspot(): Boolean {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val method = wifiManager.javaClass.getMethod("stopSoftAp")
                return method.invoke(wifiManager) as Boolean
            } else {
                val method = wifiManager.javaClass.getMethod(
                    "setWifiApEnabled", WifiConfiguration::class.java, Boolean::class.java
                )
                method.invoke(wifiManager, null, false)
                return true
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error stopping hotspot", e)
            return false
        }
    }
    
    companion object {
        private const val TAG = "HotspotService"
    }
}