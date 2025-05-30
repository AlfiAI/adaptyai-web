
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				outfit: ['Outfit', 'sans-serif'],
				inter: ['Inter', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				adapty: {
					dark: '#0a0a1a',
					darker: '#121223',
					aqua: '#00FFF7',
					purple: '#B19CFF',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'pulse-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 10px 2px rgba(0, 255, 247, 0.3)',
					},
					'50%': {
						boxShadow: '0 0 20px 5px rgba(0, 255, 247, 0.6)',
					},
				},
				'pulse-slow': {
					'0%, 100%': { 
						opacity: '0.1',
					},
					'50%': {
						opacity: '0.2',
					},
				},
				'float': {
					'0%, 100%': { 
						transform: 'translateY(0px)',
					},
					'50%': {
						transform: 'translateY(-20px)',
					},
				},
				'fade-in': {
					'0%': { 
						opacity: '0',
					},
					'100%': {
						opacity: '1',
					},
				},
				'slide-up': {
					'0%': { 
						transform: 'translateY(20px)',
						opacity: '0',
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1',
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 2s infinite ease-in-out',
				'pulse-slow': 'pulse-slow 4s infinite ease-in-out',
				'float': 'float 6s infinite ease-in-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'slide-up': 'slide-up 0.8s ease-out',
			},
			backgroundImage: {
				'gradient-dark': 'linear-gradient(to bottom, #0a0a1a, #121223)',
				'gradient-radial': 'radial-gradient(circle, rgba(177,156,255,0.15) 0%, rgba(0,255,247,0.05) 100%)',
			}
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
