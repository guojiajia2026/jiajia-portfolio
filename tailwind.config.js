/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 粉色主色系
        'pink-primary': '#FF8E9E',
        'pink-light': '#FFB6C1',
        'pink-purple': '#DDA0DD',
        // 背景色系
        'bg-top': '#FFF5F7',
        'bg-mid': '#FDE8F0',
        'bg-bottom': '#F5E6F5',
        // 文字色系
        'text-primary': '#3D2C3A',
        'text-secondary': 'rgba(60,40,50,0.7)',
        'text-tertiary': 'rgba(60,40,50,0.4)',
        'text-faint': 'rgba(60,40,50,0.3)',
        // 卡片背景
        'card-bg': 'rgba(255,255,255,0.55)',
        'card-bg-pink': 'rgba(255,240,245,0.60)',
        'card-bg-pink-light': 'rgba(255,240,245,0.70)',
        'card-bg-white': 'rgba(255,255,255,0.50)',
        // 边框色
        'border-pink': 'rgba(255,182,193,0.25)',
        'border-pink-light': 'rgba(255,182,193,0.20)',
        'border-pink-active': 'rgba(255,142,158,0.3)',
        // 阴影色
        'shadow-pink': 'rgba(255,150,180,0.12)',
        'shadow-pink-strong': 'rgba(255,150,180,0.4)',
        // 透明色
        'overlay': 'rgba(60,40,50,0.5)',
      },
      fontFamily: {
        sans: ['Quicksand', 'Nunito', 'Noto Sans SC', 'sans-serif'],
        body: ['Nunito', 'Noto Sans SC', 'sans-serif'],
        display: ['Quicksand', 'Noto Sans SC', 'sans-serif'],
      },
      fontSize: {
        'xs-sm': ['12px', '1.4'],
        'sm-md': ['13px', '1.4'],
        'base-md': ['14px', '1.6'],
        'md-lg': ['16px', '1.5'],
        'lg-xl': ['20px', '1.4'],
        'xl-2xl': ['24px', '1.3'],
      },
      borderRadius: {
        'xl-sm': '14px',
        'xl-md': '16px',
        'xl-lg': '18px',
        'xl-xl': '20px',
        'xl-2xl': '22px',
        'xl-3xl': '28px',
        'xl-4xl': '32px',
      },
      boxShadow: {
        'card': '0 8px 32px rgba(255,150,180,0.12)',
        'card-hover': '0 12px 40px rgba(255,150,180,0.20)',
        'avatar-glow': '0 0 24px rgba(255,150,180,0.4)',
        'tooltip': '0 4px 16px rgba(255,150,180,0.15)',
      },
      backdropBlur: {
        'card': '16px',
        'modal': '4px',
      },
      backgroundImage: {
        'gradient-pink': 'linear-gradient(135deg, #FFB6C1 0%, #FF8E9E 100%)',
        'gradient-pink-purple': 'linear-gradient(135deg, #FFB6C1 0%, #DDA0DD 100%)',
        'gradient-bg': 'linear-gradient(180deg, #FFF5F7 0%, #FDE8F0 50%, #F5E6F5 100%)',
        'gradient-avatar-border': 'linear-gradient(135deg, #FFB6C1, #DDA0DD)',
      },
      transitionTimingFunction: {
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      screens: {
        'mobile': '768px',
        'tablet': '768px',
        'desktop': '1200px',
      },
    },
  },
  plugins: [],
}
