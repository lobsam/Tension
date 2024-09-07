import { defineStore } from 'pinia';
import axios from 'axios';
import csvtojson from 'csvtojson';

export const useSheetStore = defineStore('sheetStore', {
  state: () => ({
    jsonData: [],
    sheetTableUrl: [
        ""
    ]
  }),
  actions: {
    async fetchSheetData() {
      const spreadsheetId = 'YOUR_SPREADSHEET_ID';
      const apiKey = 'YOUR_API_KEY';
      const range = 'Sheet1'; // Adjust based on your sheet name

      try {
        const response = await axios.get(
            "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlJkBWpGDQbWw1zX9BX_mbRdAxJjtsVKgqplFqtxhcUQPK-5f4g5fEGeo8itzKsWKdzpKdeiT0b6Ht/pub?output=csv"
        );
        const csvText = response.data

        // Use csvtojson to convert CSV data to JSON
        const json = await csvtojson().fromString(csvText);
        
        // Store the JSON data in component's state
        this.jsonData = json;
        console.log(this.jsonData)
      } catch (error) {
        console.error('Error fetching data from Google Sheets:', error);
      }
    }
  }
});
