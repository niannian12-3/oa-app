package com.oa.app.util

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.location.Address
import android.location.Geocoder
import android.os.Looper
import androidx.core.content.ContextCompat
import com.google.android.gms.location.*
import kotlinx.coroutines.tasks.await
import java.util.Locale

class LocationHelper(private val context: Context) {
    
    private val fusedLocationClient = LocationServices.getFusedLocationProviderClient(context)
    
    suspend fun getCurrentLocation(): LocationData? {
        // 检查权限
        if (ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            return null
        }
        
        return try {
            val location = fusedLocationClient.lastLocation.await()
            
            location?.let {
                val address = getAddressFromLocation(it.latitude, it.longitude)
                LocationData(
                    latitude = it.latitude,
                    longitude = it.longitude,
                    address = address,
                    accuracy = it.accuracy
                )
            }
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }
    
    private fun getAddressFromLocation(latitude: Double, longitude: Double): String? {
        return try {
            val geocoder = Geocoder(context, Locale.getDefault())
            val addresses: List<Address>? = geocoder.getFromLocation(latitude, longitude, 1)
            addresses?.firstOrNull()?.getAddressString(0)
        } catch (e: Exception) {
            null
        }
    }
    
    data class LocationData(
        val latitude: Double,
        val longitude: Double,
        val address: String?,
        val accuracy: Float
    )
}
