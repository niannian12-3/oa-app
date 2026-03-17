package com.oa.app.util

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import com.oa.app.Config
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "settings")

class AuthManager(private val context: Context) {
    
    val tokenFlow: Flow<String?> = context.dataStore.data.map { preferences ->
        preferences[stringPreferencesKey(Config.PREF_TOKEN)]
    }
    
    suspend fun saveToken(token: String) {
        context.dataStore.edit { preferences ->
            preferences[stringPreferencesKey(Config.PREF_TOKEN)] = token
        }
    }
    
    suspend fun saveUserInfo(employeeId: String, name: String) {
        context.dataStore.edit { preferences ->
            preferences[stringPreferencesKey(Config.PREF_EMPLOYEE_ID)] = employeeId
            preferences[stringPreferencesKey(Config.PREF_NAME)] = name
        }
    }
    
    suspend fun clearAuth() {
        context.dataStore.edit { preferences ->
            preferences.clear()
        }
    }
    
    suspend fun getToken(): String? {
        return context.dataStore.data.map { preferences ->
            preferences[stringPreferencesKey(Config.PREF_TOKEN)]
        }.firstOrNull()
    }
    
    suspend fun isLoggedIn(): Boolean {
        return getToken() != null
    }
}
