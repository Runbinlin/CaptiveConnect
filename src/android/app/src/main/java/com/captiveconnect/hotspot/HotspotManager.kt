package com.captiveconnect.hotspotpackage com.captiveconnect.hotspot



import android.content.Contextimport android.content.Context

import android.net.wifi.WifiConfigurationimport android.net.wifi.WifiConfiguration

import android.net.wifi.WifiManagerimport android.net.wifi.WifiManager

import android.os.Buildimport android.os.Build

import android.util.Logimport android.util.Log



/**/**

 * Manages WiFi hotspot operations for the CaptiveConnect application. * Manages WiFi hotspot operations for the CaptiveConnect application.

 * Handles both modern (Android 8.0+) and legacy Android versions. * Handles both modern (Android 8.0+) and legacy Android versions.

 */ */

class HotspotManager(private val context: Context) {class HotspotManager(private val context: Context) {

    private val wifiManager = context.getSystemService(Context.WIFI_SERVICE) as WifiManager    private val wifiManager = context.getSystemService(Context.WIFI_SERVICE) as WifiManager

        

    /**    /**

     * Creates an open WiFi hotspot with the specified SSID.     * Creates an open WiFi hotspot with the specified SSID.

     * @param ssid The name of the WiFi network to create     * @param ssid The name of the WiFi network to create

     * @return true if hotspot was created successfully, false otherwise     * @return true if hotspot was created successfully, false otherwise

     */     */

    fun createOpenHotspot(ssid: String): Boolean {    fun createOpenHotspot(ssid: String): Boolean {

        try {        try {

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {

                val method = wifiManager.javaClass.getMethod(                // Uses the modern Android 8.0+ API

                    "startSoftAp", WifiConfiguration::class.java                // Note: Requires specific permissions and possibly ROOT

                )                val method = wifiManager.javaClass.getMethod(

                                    "startSoftAp", WifiConfiguration::class.java

                val config = WifiConfiguration()                )

                config.SSID = ssid                

                config.allowedKeyManagement.set(WifiConfiguration.KeyMgmt.NONE)                val config = WifiConfiguration()

                                config.SSID = ssid

                return method.invoke(wifiManager, config) as Boolean                config.allowedKeyManagement.set(WifiConfiguration.KeyMgmt.NONE)

            } else {                

                val config = WifiConfiguration()                return method.invoke(wifiManager, config) as Boolean

                config.SSID = ssid            } else {

                config.allowedKeyManagement.set(WifiConfiguration.KeyMgmt.NONE)                // Uses reflection for legacy Android versions

                                val config = WifiConfiguration()

                val method = wifiManager.javaClass.getMethod(                config.SSID = ssid

                    "setWifiApEnabled", WifiConfiguration::class.java, Boolean::class.java                config.allowedKeyManagement.set(WifiConfiguration.KeyMgmt.NONE)

                )                

                method.invoke(wifiManager, config, true)                val method = wifiManager.javaClass.getMethod(

                return true                    "setWifiApEnabled", WifiConfiguration::class.java, Boolean::class.java

            }                )

        } catch (e: Exception) {                method.invoke(wifiManager, config, true)

            Log.e("HotspotManager", "Error creating hotspot", e)                return true

            return false            }

        }        } catch (e: Exception) {

    }            Log.e("HotspotManager", "Error creating hotspot", e)

                return false

    /**        }

     * Stops the currently running WiFi hotspot.    }

     * @return true if hotspot was stopped successfully, false otherwise    

     */    /**

    fun stopHotspot(): Boolean {     * Stops the currently running WiFi hotspot.

        try {     * @return true if hotspot was stopped successfully, false otherwise

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {     */

                val method = wifiManager.javaClass.getMethod("stopSoftAp")    fun stopHotspot(): Boolean {

                return method.invoke(wifiManager) as Boolean        try {

            } else {            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {

                val method = wifiManager.javaClass.getMethod(                val method = wifiManager.javaClass.getMethod("stopSoftAp")

                    "setWifiApEnabled", WifiConfiguration::class.java, Boolean::class.java                return method.invoke(wifiManager) as Boolean

                )            } else {

                method.invoke(wifiManager, null, false)                val method = wifiManager.javaClass.getMethod(

                return true                    "setWifiApEnabled", WifiConfiguration::class.java, Boolean::class.java

            }                )

        } catch (e: Exception) {                method.invoke(wifiManager, null, false)

            Log.e("HotspotManager", "Error stopping hotspot", e)                return true

            return false            }

        }        } catch (e: Exception) {

    }            Log.e("HotspotManager", "Error stopping hotspot", e)

}            return false
        }
    }
}