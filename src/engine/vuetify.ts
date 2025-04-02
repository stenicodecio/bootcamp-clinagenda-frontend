import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { pt } from 'vuetify/locale'
import { VCalendar } from 'vuetify/labs/VCalendar'
import { VDateInput } from 'vuetify/labs/components'
import colors from 'vuetify/util/colors'

export default createVuetify({
  locale: {
    locale: 'pt',
    messages: { pt }
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          primary: colors.teal.darken1
        }
      }
    }
  },
  components: {
    VCalendar,
    VDateInput
  },
  defaults: {
    VDataTableServer: {
      itemsPerPageOptions: [10, 25, 50, 100]
    },
    VDataTable: {
      itemsPerPageOptions: [10, 25, 50, 100]
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary'
    },
    VTextarea: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary'
    },
    VDateInput: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary'
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable'
    },
    VCombobox: {
      variant: 'outlined',
      density: 'comfortable',
      autoSelectFirst: 'exact'
    },
    VAutocomplete: {
      variant: 'outlined',
      density: 'comfortable'
    },
    VSwitch: {
      density: 'comfortable'
    },
    VSheet: {
      rounded: true
    },
    VBreadcrumbs: {
      style: 'padding: 0'
    },
    VCheckbox: {
      density: 'comfortable',
      hideDetails: true,
      color: 'primary'
    }
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  }
})
