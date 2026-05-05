import { defineStore } from 'pinia'
import axios from 'axios'
import csvtojson from 'csvtojson'

const SHEET_TABLE_URL = {
  themes:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTlJkBWpGDQbWw1zX9BX_mbRdAxJjtsVKgqplFqtxhcUQPK-5f4g5fEGeo8itzKsWKdzpKdeiT0b6Ht/pub?gid=0&single=true&output=csv',
  pages:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTlJkBWpGDQbWw1zX9BX_mbRdAxJjtsVKgqplFqtxhcUQPK-5f4g5fEGeo8itzKsWKdzpKdeiT0b6Ht/pub?gid=1999087703&single=true&output=csv',
  articls:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTlJkBWpGDQbWw1zX9BX_mbRdAxJjtsVKgqplFqtxhcUQPK-5f4g5fEGeo8itzKsWKdzpKdeiT0b6Ht/pub?gid=1030071400&single=true&output=csv',
  art: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTlJkBWpGDQbWw1zX9BX_mbRdAxJjtsVKgqplFqtxhcUQPK-5f4g5fEGeo8itzKsWKdzpKdeiT0b6Ht/pub?gid=1247829862&single=true&output=csv',
  self_published_articles:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTlJkBWpGDQbWw1zX9BX_mbRdAxJjtsVKgqplFqtxhcUQPK-5f4g5fEGeo8itzKsWKdzpKdeiT0b6Ht/pub?gid=2023108309&single=true&output=csv',
  upcoming_event:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTlJkBWpGDQbWw1zX9BX_mbRdAxJjtsVKgqplFqtxhcUQPK-5f4g5fEGeo8itzKsWKdzpKdeiT0b6Ht/pub?gid=2146752073&single=true&output=csv',
  exhibition:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTlJkBWpGDQbWw1zX9BX_mbRdAxJjtsVKgqplFqtxhcUQPK-5f4g5fEGeo8itzKsWKdzpKdeiT0b6Ht/pub?gid=1453303916&single=true&output=csv',
  field_sketches:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTlJkBWpGDQbWw1zX9BX_mbRdAxJjtsVKgqplFqtxhcUQPK-5f4g5fEGeo8itzKsWKdzpKdeiT0b6Ht/pub?gid=557648978&single=true&output=csv'
}

const createEmptySheetData = () =>
  Object.keys(SHEET_TABLE_URL).reduce((acc, key) => {
    acc[key] = []
    return acc
  }, {})

const createSheetStatusMap = () =>
  Object.keys(SHEET_TABLE_URL).reduce((acc, key) => {
    acc[key] = {
      status: 'idle',
      errorMessage: '',
      hasStaleData: false,
      lastLoadedAt: null
    }
    return acc
  }, {})

const resolveSheetKeys = (sheetKeys = []) => {
  if (!Array.isArray(sheetKeys) || sheetKeys.length === 0) {
    return Object.keys(SHEET_TABLE_URL)
  }

  return sheetKeys.filter((key) => key in SHEET_TABLE_URL)
}

const getErrorMessage = (error, key) => {
  const fallback = `Could not load ${key.replaceAll('_', ' ')} content.`
  const responseStatus = error?.response?.status

  if (responseStatus) {
    return `${fallback} (status ${responseStatus})`
  }

  return fallback
}

export const useSheetStore = defineStore('sheetStore', {
  state: () => ({
    sheetTableUrl: SHEET_TABLE_URL,
    dataFromSheetUrl: createEmptySheetData(),
    sheetStatus: createSheetStatusMap(),
    loading: false,
    hasLoadedOnce: false,
    lastLoadedAt: null
  }),
  getters: {
    getSheetStatus: (state) => (sheetKey) =>
      state.sheetStatus[sheetKey] ?? {
        status: 'idle',
        errorMessage: '',
        hasStaleData: false,
        lastLoadedAt: null
      },
    isSheetLoading: (state) => (sheetKey) => state.sheetStatus[sheetKey]?.status === 'loading',
    getSheetError: (state) => (sheetKey) => state.sheetStatus[sheetKey]?.errorMessage || '',
    hasSheetData: (state) => (sheetKey) => {
      const rows = state.dataFromSheetUrl[sheetKey]
      return Array.isArray(rows) && rows.length > 0
    },
    hasAnyData: (state) =>
      Object.values(state.dataFromSheetUrl).some((rows) => Array.isArray(rows) && rows.length > 0),
    failedSheets: (state) =>
      Object.entries(state.sheetStatus)
        .filter(([, details]) => details.status === 'error')
        .map(([sheetKey]) => sheetKey),
    hasPartialFailures() {
      return this.failedSheets.length > 0
    }
  },
  actions: {
    setSheetStatus(sheetKey, updates) {
      this.sheetStatus[sheetKey] = {
        ...(this.sheetStatus[sheetKey] || {}),
        ...updates
      }
    },
    async fetchSingleSheet(sheetKey, url) {
      const hasCachedData = this.hasSheetData(sheetKey)

      if (typeof url !== 'string' || url.trim() === '') {
        this.setSheetStatus(sheetKey, {
          status: 'success',
          errorMessage: '',
          hasStaleData: false,
          lastLoadedAt: new Date().toISOString()
        })
        return { sheetKey, status: 'success' }
      }

      this.setSheetStatus(sheetKey, {
        status: 'loading',
        errorMessage: '',
        hasStaleData: hasCachedData
      })

      try {
        const response = await axios.get(url, { timeout: 15000 })
        const csvText = response.data
        const rows = await csvtojson().fromString(csvText)

        this.dataFromSheetUrl[sheetKey] = Array.isArray(rows) ? rows : []
        this.setSheetStatus(sheetKey, {
          status: 'success',
          errorMessage: '',
          hasStaleData: false,
          lastLoadedAt: new Date().toISOString()
        })

        return { sheetKey, status: 'success' }
      } catch (error) {
        if (!hasCachedData) {
          this.dataFromSheetUrl[sheetKey] = []
        }

        this.setSheetStatus(sheetKey, {
          status: 'error',
          errorMessage: getErrorMessage(error, sheetKey),
          hasStaleData: hasCachedData
        })

        console.error('Error fetching data from Google Sheets:', error)

        return { sheetKey, status: 'error', error }
      }
    },
    async fetchSheetData(options = {}) {
      const { force = false, sheetKeys = [] } = options
      const keysToFetch = resolveSheetKeys(sheetKeys)

      if (keysToFetch.length === 0 || this.loading) {
        return {
          total: 0,
          successCount: 0,
          failedCount: 0
        }
      }

      const alreadyLoaded =
        !force && keysToFetch.every((sheetKey) => this.getSheetStatus(sheetKey).status === 'success')

      if (alreadyLoaded) {
        return {
          total: keysToFetch.length,
          successCount: keysToFetch.length,
          failedCount: 0
        }
      }

      this.loading = true

      try {
        const requests = keysToFetch.map((sheetKey) =>
          this.fetchSingleSheet(sheetKey, this.sheetTableUrl[sheetKey])
        )
        const results = await Promise.all(requests)
        const successCount = results.filter((result) => result.status === 'success').length
        const failedCount = results.length - successCount

        this.hasLoadedOnce = true
        this.lastLoadedAt = new Date().toISOString()

        return {
          total: results.length,
          successCount,
          failedCount
        }
      } finally {
        this.loading = false
      }
    },
    async retryFailedSheets() {
      if (!this.failedSheets.length) {
        return {
          total: 0,
          successCount: 0,
          failedCount: 0
        }
      }

      return this.fetchSheetData({
        force: true,
        sheetKeys: this.failedSheets
      })
    }
  }
})
