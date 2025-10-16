import 'package:flutter/material.dart';

class AppTheme {
  // Brand colors
  static const transportPrimary = Color(0xFF374151);
  static const transportSecondary = Color(0xFF3B82F6);
  static const transportAccent = Color(0xFF10B981);
  
  static const foodPrimary = Color(0xFF92400E);
  static const foodSecondary = Color(0xFF84CC16);
  static const foodAccent = Color(0xFFFEF3C7);
  
  static const martPrimary = Color(0xFF0D9488);
  static const martSecondary = Color(0xFFF97316);
  static const martAccent = Color(0xFFF0FDF4);

  static ThemeData lightTheme = ThemeData(
    primarySwatch: Colors.green,
    scaffoldBackgroundColor: Colors.grey[50],
    appBarTheme: const AppBarTheme(
      elevation: 0,
      backgroundColor: transportAccent,
      foregroundColor: Colors.white,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    ),
  );
}