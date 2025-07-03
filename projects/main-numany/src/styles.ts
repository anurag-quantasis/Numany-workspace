import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const MyPreset = definePreset(Aura, {
  semantic: {
    colorScheme: {
      light: {
        primary: {
          50: '#E5F2F2',
          100: '#B8D9DA',
          200: '#8AC0C1',
          300: '#5CA7A9',
          400: '#2E8E8F',
          500: '#007A7C',
          600: '#006263',
          700: '#00494A',
          800: '#003132',
          900: '#001819',
        },
        secondary: {
          50: '#E5F0ED',
          100: '#B8D1C9',
          200: '#8AB2A6',
          300: '#5C9382',
          400: '#2E745F',
          500: '#00694F',
          600: '#00543F',
          700: '#003F2F',
          800: '#002A20',
          900: '#001510',
        },
      },
    },
  },
  components: {
    card: {
      // border: {
      //   radius: '0',
      // },
      body: {
        padding: '0',
      },
      colorScheme: {
        light: {
          root: {
            // background: '{red.100}',
            // color: '{surface.700}'
          },
          subtitle: {
            // color: '{surface.500}'
          },
        },
        dark: {
          root: {
            background: '{surface.900}',
            color: '{surface.0}',
          },
          subtitle: {
            color: '{surface.400}',
          },
        },
      },
    },
  },
});
