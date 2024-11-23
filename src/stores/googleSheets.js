import { defineStore } from 'pinia'
import axios from 'axios'
import csvtojson from 'csvtojson'

export const useSheetStore = defineStore('sheetStore', {
  state: () => ({
    jsonData: [],
    sheetTableUrl: {
      themes: import.meta.env.VITE_THEMES_URL,
      pages: import.meta.env.VITE_PAGES_URL,
      articls: import.meta.env.VITE_ARTICLES_URL,
      art: import.meta.env.VITE_ARTS_URL
    },
    dataFromSheetUrl: {},
    loading: false
  }),
  actions: {
    async fetchSheetData() {
      this.loading = true

      try {
        for (const [key, url] of Object.entries(this.sheetTableUrl)) {
          let response = await axios.get(url)
          let csvText = response.data

          // Use csvtojson to convert CSV data to JSON
          this.dataFromSheetUrl[key] = await csvtojson().fromString(csvText)
        }
      } catch (error) {
        console.error('Error fetching data from Google Sheets:', error)
      } finally {
        this.loading = false
      }
    }
  }
})
