package com.oa.app

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.findNavController
import androidx.navigation.ui.setupWithNavController
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.oa.app.util.AuthManager

class MainActivity : AppCompatActivity() {
    
    private lateinit var authManager: AuthManager
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        authManager = AuthManager(this)
        
        val navController = findNavController(R.id.nav_host_fragment)
        val bottomNavigationView = findViewById<BottomNavigationView>(R.id.bottom_navigation)
        bottomNavigationView.setupWithNavController(navController)
    }
    
    suspend fun isLoggedIn(): Boolean {
        return authManager.isLoggedIn()
    }
    
    suspend fun logout() {
        authManager.clearAuth()
    }
}
