package com.hios.mobile;
import android.os.Bundle;

import androidx.core.view.WindowCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Ensure webview draws behind the transparent status and navigation bars natively
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
    }
}