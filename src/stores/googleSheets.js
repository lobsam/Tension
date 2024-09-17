import { defineStore } from 'pinia'
import axios from 'axios'
import csvtojson from 'csvtojson'

export const useSheetStore = defineStore('sheetStore', {
  state: () => ({
    jsonData: [],
    sheetTableUrl: {
      themes:
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vTlJkBWpGDQbWw1zX9BX_mbRdAxJjtsVKgqplFqtxhcUQPK-5f4g5fEGeo8itzKsWKdzpKdeiT0b6Ht/pub?gid=0&single=true&output=csv',
      pages:
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vTlJkBWpGDQbWw1zX9BX_mbRdAxJjtsVKgqplFqtxhcUQPK-5f4g5fEGeo8itzKsWKdzpKdeiT0b6Ht/pub?gid=1999087703&single=true&output=csv',
      articls:
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vTlJkBWpGDQbWw1zX9BX_mbRdAxJjtsVKgqplFqtxhcUQPK-5f4g5fEGeo8itzKsWKdzpKdeiT0b6Ht/pub?gid=1999087703&single=true&output=csv',
      art: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTlJkBWpGDQbWw1zX9BX_mbRdAxJjtsVKgqplFqtxhcUQPK-5f4g5fEGeo8itzKsWKdzpKdeiT0b6Ht/pub?gid=1247829862&single=true&output=csv'
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
          console.log('data:reload ', this.dataFromSheetUrl)
        }
      } catch (error) {
        console.error('Error fetching data from Google Sheets:', error)
      } finally {
        this.loading = false
      }
    }
  }
})
