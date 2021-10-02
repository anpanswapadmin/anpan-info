import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect, useState } from 'react'
import { client } from '../apollo/client'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useTimeframe } from './Application'
import {
  getPercentChange,
  getBlockFromTimestamp,
  getBlocksFromTimestamps,
  get2DayPercentChange,
  getTimeframe,
} from '../utils'
import { GLOBAL_DATA, GLOBAL_TXNS, GLOBAL_CHART, BNB_PRICE, ALL_PAIRS, ALL_TOKENS } from '../apollo/queries'
import weekOfYear from 'dayjs/plugin/weekOfYear'
const UPDATE = 'UPDATE'
const UPDATE_TXNS = 'UPDATE_TXNS'
const UPDATE_CHART = 'UPDATE_CHART'
const UPDATE_BNB_PRICE = 'UPDATE_BNB_PRICE'
const BNB_PRICE_KEY = 'BNB_PRICE_KEY'
const UPDATE_ALL_PAIRS_IN_ANPANSWAP = 'UPDAUPDATE_ALL_PAIRS_IN_ANPANSWAPTE_TOP_PAIRS'
const UPDATE_ALL_TOKENS_IN_ANPANSWAP = 'UPDATE_ALL_TOKENS_IN_ANPANSWAP'
const UPDATE_TOP_LPS = 'UPDATE_TOP_LPS'

// format dayjs with the libraries that we need
dayjs.extend(utc)
dayjs.extend(weekOfYear)

const GlobalDataContext = createContext()

function useGlobalDataContext() {
  return useContext(GlobalDataContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE: {
      const { data } = payload
      return {
        ...state,
        globalData: data,
      }
    }
    case UPDATE_TXNS: {
      const { transactions } = payload
      return {
        ...state,
        transactions,
      }
    }
    case UPDATE_CHART: {
      const { daily, weekly } = payload
      return {
        ...state,
        chartData: {
          daily,
          weekly,
        },
      }
    }
    case UPDATE_BNB_PRICE: {
      const { bnbPrice, oneDayPrice, bnbPriceChange } = payload
      return {
        [BNB_PRICE_KEY]: bnbPrice,
        oneDayPrice,
        bnbPriceChange,
      }
    }

    case UPDATE_ALL_PAIRS_IN_ANPANSWAP: {
      const { allPairs } = payload
      return {
        ...state,
        allPairs,
      }
    }

    case UPDATE_ALL_TOKENS_IN_ANPANSWAP: {
      const { allTokens } = payload
      return {
        ...state,
        allTokens,
      }
    }

    case UPDATE_TOP_LPS: {
      const { topLps } = payload
      return {
        ...state,
        topLps,
      }
    }
    default: {
      throw Error(`Unexpected action type in DataContext reducer: '${type}'.`)
    }
  }
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, {})
  const update = useCallback((data) => {
    dispatch({
      type: UPDATE,
      payload: {
        data,
      },
    })
  }, [])

  const updateTransactions = useCallback((transactions) => {
    dispatch({
      type: UPDATE_TXNS,
      payload: {
        transactions,
      },
    })
  }, [])

  const updateChart = useCallback((daily, weekly) => {
    dispatch({
      type: UPDATE_CHART,
      payload: {
        daily,
        weekly,
      },
    })
  }, [])

  const updateBnbPrice = useCallback((bnbPrice, oneDayPrice, bnbPriceChange) => {
    dispatch({
      type: UPDATE_BNB_PRICE,
      payload: {
        bnbPrice,
        oneDayPrice,
        bnbPriceChange,
      },
    })
  }, [])

  const updateAllPairsInAnpanswap = useCallback((allPairs) => {
    dispatch({
      type: UPDATE_ALL_PAIRS_IN_ANPANSWAP,
      payload: {
        allPairs,
      },
    })
  }, [])

  const updateAllTokensInAnpanswap = useCallback((allTokens) => {
    dispatch({
      type: UPDATE_ALL_TOKENS_IN_ANPANSWAP,
      payload: {
        allTokens,
      },
    })
  }, [])

  const updateTopLps = useCallback((topLps) => {
    dispatch({
      type: UPDATE_TOP_LPS,
      payload: {
        topLps,
      },
    })
  }, [])
  return (
    <GlobalDataContext.Provider
      value={useMemo(
        () => [
          state,
          {
            update,
            updateTransactions,
            updateChart,
            updateBnbPrice,
            updateTopLps,
            updateAllPairsInAnpanswap,
            updateAllTokensInAnpanswap,
          },
        ],
        [
          state,
          update,
          updateTransactions,
          updateTopLps,
          updateChart,
          updateBnbPrice,
          updateAllPairsInAnpanswap,
          updateAllTokensInAnpanswap,
        ]
      )}
    >
      {children}
    </GlobalDataContext.Provider>
  )
}

/**
 * Gets all the global data for the overview page.
 * Needs current bnb price and the old bnb price to get
 * 24 hour USD changes.
 * @param {*} bnbPrice
 * @param {*} oldBnbPrice
 */
async function getGlobalData(bnbPrice, oldBnbPrice) {
  // data for each day , historic data used for % changes
  let data = {}
  let oneDayData = {}
  let twoDayData = {}

  try {
    // get timestamps for the days
    const utcCurrentTime = dayjs()
    const utcOneDayBack = utcCurrentTime.subtract(1, 'day').unix()
    const utcTwoDaysBack = utcCurrentTime.subtract(2, 'day').unix()
    const utcOneWeekBack = utcCurrentTime.subtract(1, 'week').unix()
    const utcTwoWeeksBack = utcCurrentTime.subtract(2, 'week').unix()

    // get the blocks needed for time travel queries
    let [oneDayBlock, twoDayBlock, oneWeekBlock, twoWeekBlock] = await getBlocksFromTimestamps([
      utcOneDayBack,
      utcTwoDaysBack,
      utcOneWeekBack,
      utcTwoWeeksBack,
    ])

    // fetch the global data
    let result = await client.query({
      query: GLOBAL_DATA(),
      fetchPolicy: 'cache-first',
    })
    data = result.data.anpansFactories[0]

    // fetch the historical data
    let oneDayResult = await client.query({
      query: GLOBAL_DATA(oneDayBlock?.number),
      fetchPolicy: 'cache-first',
    })
    oneDayData = oneDayResult.data.anpansFactories[0]

    let twoDayResult = await client.query({
      query: GLOBAL_DATA(twoDayBlock?.number),
      fetchPolicy: 'cache-first',
    })
    twoDayData = twoDayResult.data.anpansFactories[0]

    let oneWeekResult = await client.query({
      query: GLOBAL_DATA(oneWeekBlock?.number),
      fetchPolicy: 'cache-first',
    })
    const oneWeekData = oneWeekResult.data.anpansFactories[0]

    let twoWeekResult = await client.query({
      query: GLOBAL_DATA(twoWeekBlock?.number),
      fetchPolicy: 'cache-first',
    })
    const twoWeekData = twoWeekResult.data.anpansFactories[0]

    if (data && oneDayData && twoDayData && twoWeekData) {
      let [oneDayVolumeUSD, volumeChangeUSD] = get2DayPercentChange(
        data.totalVolumeUSD,
        oneDayData.totalVolumeUSD ? oneDayData.totalVolumeUSD : 0,
        twoDayData.totalVolumeUSD ? twoDayData.totalVolumeUSD : 0
      )

      const [oneWeekVolume, weeklyVolumeChange] = get2DayPercentChange(
        data.totalVolumeUSD,
        oneWeekData.totalVolumeUSD,
        twoWeekData.totalVolumeUSD
      )

      const [oneDayTxns, txnChange] = get2DayPercentChange(
        data.txCount,
        oneDayData.txCount ? oneDayData.txCount : 0,
        twoDayData.txCount ? twoDayData.txCount : 0
      )

      // format the total liquidity in USD
      data.totalLiquidityUSD = data.totalLiquidityBNB * bnbPrice
      const liquidityChangeUSD = getPercentChange(
        data.totalLiquidityBNB * bnbPrice,
        oneDayData.totalLiquidityBNB * oldBnbPrice
      )

      // add relevant fields with the calculated amounts
      data.oneDayVolumeUSD = oneDayVolumeUSD
      data.oneWeekVolume = oneWeekVolume
      data.weeklyVolumeChange = weeklyVolumeChange
      data.volumeChangeUSD = volumeChangeUSD
      data.liquidityChangeUSD = liquidityChangeUSD
      data.oneDayTxns = oneDayTxns
      data.txnChange = txnChange
    }
  } catch (e) {
    console.log(e)
  }

  return data
}

/**
 * Get historical data for volume and liquidity used in global charts
 * on main page
 * @param {*} oldestDateToFetch // start of window to fetch from
 */
const getChartData = async (oldestDateToFetch) => {
  let data = []
  let weeklyData = []
  const utcEndTime = dayjs.utc()
  let skip = 0
  let allFound = false

  try {
    while (!allFound) {
      let result = await client.query({
        query: GLOBAL_CHART,
        variables: {
          startTime: oldestDateToFetch,
          skip,
        },
        fetchPolicy: 'cache-first',
      })
      skip += 1000
      data = data.concat(result.data.anpansDayDatas)
      if (result.data.anpansDayDatas.length < 1000) {
        allFound = true
      }
    }

    if (data) {
      let dayIndexSet = new Set()
      let dayIndexArray = []
      const oneDay = 24 * 60 * 60

      // for each day, parse the daily volume and format for chart array
      data.forEach((dayData, i) => {
        // add the day index to the set of days
        dayIndexSet.add((data[i].date / oneDay).toFixed(0))
        dayIndexArray.push(data[i])
        dayData.dailyVolumeUSD = parseFloat(dayData.dailyVolumeUSD)
      })

      // fill in empty days ( there will be no day datas if no trades made that day )
      let timestamp = data[0].date ? data[0].date : oldestDateToFetch
      let latestLiquidityUSD = data[0].totalLiquidityUSD
      let latestDayDats = data[0].mostLiquidTokens
      let index = 1
      while (timestamp < utcEndTime.unix() - oneDay) {
        const nextDay = timestamp + oneDay
        let currentDayIndex = (nextDay / oneDay).toFixed(0)
        if (!dayIndexSet.has(currentDayIndex)) {
          data.push({
            date: nextDay,
            dailyVolumeUSD: 0,
            totalLiquidityUSD: latestLiquidityUSD,
            mostLiquidTokens: latestDayDats,
          })
        } else {
          latestLiquidityUSD = dayIndexArray[index].totalLiquidityUSD
          latestDayDats = dayIndexArray[index].mostLiquidTokens
          index = index + 1
        }
        timestamp = nextDay
      }
    }

    // format weekly data for weekly sized chunks
    data = data.sort((a, b) => (parseInt(a.date) > parseInt(b.date) ? 1 : -1))
    let startIndexWeekly = -1
    let currentWeek = -1
    data.forEach((entry, i) => {
      const week = dayjs.utc(dayjs.unix(data[i].date)).week()
      if (week !== currentWeek) {
        currentWeek = week
        startIndexWeekly++
      }
      weeklyData[startIndexWeekly] = weeklyData[startIndexWeekly] || {}
      weeklyData[startIndexWeekly].date = data[i].date
      weeklyData[startIndexWeekly].weeklyVolumeUSD =
        (weeklyData[startIndexWeekly].weeklyVolumeUSD ?? 0) + data[i].dailyVolumeUSD
    })
  } catch (e) {
    console.log(e)
  }
  return [data, weeklyData]
}

/**
 * Get and format transactions for global page
 */
const getGlobalTransactions = async () => {
  let transactions = {}

  try {
    let result = await client.query({
      query: GLOBAL_TXNS,
      fetchPolicy: 'cache-first',
    })
    transactions.mints = []
    transactions.burns = []
    transactions.swaps = []
    result?.data?.transactions &&
      result.data.transactions.map((transaction) => {
        if (transaction.mints.length > 0) {
          transaction.mints.map((mint) => {
            return transactions.mints.push(mint)
          })
        }
        if (transaction.burns.length > 0) {
          transaction.burns.map((burn) => {
            return transactions.burns.push(burn)
          })
        }
        if (transaction.swaps.length > 0) {
          transaction.swaps.map((swap) => {
            return transactions.swaps.push(swap)
          })
        }
        return true
      })
  } catch (e) {
    console.log(e)
  }

  return transactions
}

/**
 * Gets the current price  of BNB, 24 hour price, and % change between them
 */
const getBnbPrice = async () => {
  const utcCurrentTime = dayjs()
  const utcOneDayBack = utcCurrentTime.subtract(1, 'day').startOf('minute').unix()

  let bnbPrice = 0
  let bnbPriceOneDay = 0
  let priceChangeBNB = 0

  try {
    let oneDayBlock = await getBlockFromTimestamp(utcOneDayBack)
    let result = await client.query({
      query: BNB_PRICE(),
      fetchPolicy: 'cache-first',
    })
    let resultOneDay = await client.query({
      query: BNB_PRICE(oneDayBlock),
      fetchPolicy: 'cache-first',
    })
    const currentPrice = result?.data?.bundles[0]?.bnbPrice
    const oneDayBackPrice = resultOneDay?.data?.bundles[0]?.bnbPrice
    priceChangeBNB = getPercentChange(currentPrice, oneDayBackPrice)
    bnbPrice = currentPrice
    bnbPriceOneDay = oneDayBackPrice
  } catch (e) {
    console.log(e)
  }

  return [bnbPrice, bnbPriceOneDay, priceChangeBNB]
}

const PAIRS_TO_FETCH = 100
const TOKENS_TO_FETCH = 100

/**
 * Loop through every pair on anpanswap, used for search
 */
async function getAllPairsOnAnpanswap() {
  const utcCurrentTime = dayjs()
  const utcOneHourBack = utcCurrentTime.subtract(1, 'hour').startOf('minute').unix()
  let oneHourBlock = await getBlockFromTimestamp(utcOneHourBack)

  try {
    let allFound = false
    let pairs = []
    let skipCount = 0
    while (!allFound) {
      let result = await client.query({
        query: ALL_PAIRS(oneHourBlock),
        variables: {
          skip: skipCount,
        },
        fetchPolicy: 'cache-first',
      })
      skipCount = skipCount + PAIRS_TO_FETCH
      pairs = pairs.concat(result?.data?.pairs)
      if (result?.data?.pairs.length < PAIRS_TO_FETCH || pairs.length > PAIRS_TO_FETCH) {
        allFound = true
      }
    }
    return pairs
  } catch (e) {
    console.log(e)
  }
}

/**
 * Loop through every token on anpanswap, used for search
 */
async function getAllTokensOnAnpanswap() {
  try {
    let allFound = false
    let skipCount = 0
    let tokens = []
    while (!allFound) {
      let result = await client.query({
        query: ALL_TOKENS,
        variables: {
          skip: skipCount,
        },
        fetchPolicy: 'cache-first',
      })
      tokens = tokens.concat(result?.data?.tokens)
      if (result?.data?.tokens?.length < TOKENS_TO_FETCH || tokens.length > TOKENS_TO_FETCH) {
        allFound = true
      }
      skipCount = skipCount += TOKENS_TO_FETCH
    }
    return tokens
  } catch (e) {
    console.log(e)
  }
}

/**
 * Hook that fetches overview data, plus all tokens and pairs for search
 */
export function useGlobalData() {
  const [state, { update, updateAllPairsInAnpanswap, updateAllTokensInAnpanswap }] = useGlobalDataContext()
  const [bnbPrice, oldBnbPrice] = useBnbPrice()

  const data = state?.globalData

  useEffect(() => {
    async function fetchData() {
      let globalData = await getGlobalData(bnbPrice, oldBnbPrice)
      globalData && update(globalData)

      let allPairs = await getAllPairsOnAnpanswap()
      updateAllPairsInAnpanswap(allPairs)

      let allTokens = await getAllTokensOnAnpanswap()
      updateAllTokensInAnpanswap(allTokens)
    }
    if (!data && bnbPrice && oldBnbPrice) {
      fetchData()
    }
  }, [bnbPrice, oldBnbPrice, update, data, updateAllPairsInAnpanswap, updateAllTokensInAnpanswap])

  return data || {}
}

export function useGlobalChartData() {
  const [state, { updateChart }] = useGlobalDataContext()
  const [oldestDateFetch, setOldestDateFetched] = useState()
  const [activeWindow] = useTimeframe()

  const chartDataDaily = state?.chartData?.daily
  const chartDataWeekly = state?.chartData?.weekly

  /**
   * Keep track of oldest date fetched. Used to
   * limit data fetched until its actually needed.
   * (dont fetch year long stuff unless year option selected)
   */
  useEffect(() => {
    // based on window, get starttime
    let startTime = getTimeframe(activeWindow)

    if ((activeWindow && startTime < oldestDateFetch) || !oldestDateFetch) {
      setOldestDateFetched(startTime)
    }
  }, [activeWindow, oldestDateFetch])

  /**
   * Fetch data if none fetched or older data is needed
   */
  useEffect(() => {
    async function fetchData() {
      // historical stuff for chart
      let [newChartData, newWeeklyData] = await getChartData(oldestDateFetch)
      updateChart(newChartData, newWeeklyData)
    }
    if (oldestDateFetch && !(chartDataDaily && chartDataWeekly)) {
      fetchData()
    }
  }, [chartDataDaily, chartDataWeekly, oldestDateFetch, updateChart])

  return [chartDataDaily, chartDataWeekly]
}

export function useGlobalTransactions() {
  const [state, { updateTransactions }] = useGlobalDataContext()
  const transactions = state?.transactions
  useEffect(() => {
    async function fetchData() {
      if (!transactions) {
        let txns = await getGlobalTransactions()
        updateTransactions(txns)
      }
    }
    fetchData()
  }, [updateTransactions, transactions])
  return transactions
}

export function useBnbPrice() {
  const [state, { updateBnbPrice }] = useGlobalDataContext()
  const bnbPrice = state?.[BNB_PRICE_KEY]
  const bnbPriceOld = state?.['oneDayPrice']
  useEffect(() => {
    async function checkForBnbPrice() {
      if (!bnbPrice) {
        let [newPrice, oneDayPrice, priceChange] = await getBnbPrice()
        updateBnbPrice(newPrice, oneDayPrice, priceChange)
      }
    }
    checkForBnbPrice()
  }, [bnbPrice, updateBnbPrice])

  return [bnbPrice, bnbPriceOld]
}

export function useAllPairsInAnpanswap() {
  const [state] = useGlobalDataContext()
  let allPairs = state?.allPairs

  return allPairs || []
}

export function useAllTokensInAnpanswap() {
  const [state] = useGlobalDataContext()
  let allTokens = state?.allTokens

  return allTokens || []
}
