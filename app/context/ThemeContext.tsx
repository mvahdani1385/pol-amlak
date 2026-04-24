// context/ThemeContext.tsx
"use client"; // اضافه کردن این خط

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<string>('theme-light'); // پیش‌فرض تم روشن
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme_mode') || 'theme-light';
        setTheme(savedTheme);
        document.querySelector('html')?.classList.add(savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'theme-light' ? 'theme-dark' : 'theme-light';
        setTheme(newTheme);
        localStorage.setItem('theme_mode', newTheme);
        document.querySelector('html')?.classList.remove(theme);
        document.querySelector('html')?.classList.add(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
