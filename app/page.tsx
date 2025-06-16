'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Cloud, Download, Play, Square, AlertCircle, CheckCircle, Clock, MapPin, Users } from 'lucide-react'
import { US_STATES_ZIP_COUNTS } from '@/lib/zip-data'

interface WeatherData {
  zip_code: string
  city: string
  date_time_utc: string
  temp_f: number
  temp_c: number
  feels_like_f: number
  feels_like_c: number
  humidity: number
  pressure_hpa: number
  wind_speed_mps: number
  wind_direction_deg: number
  cloud_cover_percent: number
  sunrise_utc: string
  sunset_utc: string
  weather_description: string
}

interface ProgressUpdate {
  type: 'progress' | 'error' | 'completed' | 'keepalive'
  current?: number
  total?: number
  zip_code?: string
  status?: string
  message?: string
}

interface ActivityLogEntry {
  timestamp: string
  type: 'info' | 'error' | 'success'
  message: string
}

export default function WeatherFetcher() {
  const [apiKey, setApiKey] = useState('')
  const [customZipCodes, setCustomZipCodes] = useState('')
  const [selectedStates, setSelectedStates] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentZip, setCurrentZip] = useState('')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [weatherData, setWeatherData] = useState<WeatherData[]>([])
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([])
  const [totalZips, setTotalZips] = useState(0)
  const [processedZips, setProcessedZips] = useState(0)
  const [errorCount, setErrorCount] = useState(0)
  const [activeTab, setActiveTab] = useState('setup')
  const eventSourceRef = useRef<EventSource | null>(null)

  const addLogEntry = (type: 'info' | 'error' | 'success', message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setActivityLog(prev => [{ timestamp, type, message }, ...prev])
  }

  const getTotalZipCount = () => {
    if (selectedStates.length === 0) return 0
    return selectedStates.reduce((total, state) => {
      return total + (US_STATES_ZIP_COUNTS[state] || 0)
    }, 0)
  }

  const getZipCodesForProcessing = () => {
    const customZips = customZipCodes
      .split('\n')
      .map(zip => zip.trim())
      .filter(zip => zip.length === 5 && /^\d+$/.test(zip))

    if (customZips.length > 0) {
      return customZips
    }

    // For state-based processing, we'll need to fetch ZIP codes from an API or database
    // For now, we'll return an empty array and handle this in the backend
    return []
  }

  const startWeatherFetching = async () => {
    if (!apiKey.trim()) {
      addLogEntry('error', 'Please enter your OpenWeatherMap API key')
      return
    }

    const zipCodes = getZipCodesForProcessing()
    const useStates = selectedStates.length > 0 && customZipCodes.trim() === ''

    if (!useStates && zipCodes.length === 0) {
      addLogEntry('error', 'Please enter ZIP codes or select states to process')
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setProcessedZips(0)
    setErrorCount(0)
    setWeatherData([])
    setActiveTab('progress')

    const totalCount = useStates ? getTotalZipCount() : zipCodes.length
    setTotalZips(totalCount)

    addLogEntry('info', `Starting weather data fetch for ${totalCount.toLocaleString()} ZIP codes`)

    try {
      const requestBody = useStates 
        ? { api_key: apiKey, states: selectedStates }
        : { api_key: apiKey, zip_codes: zipCodes }

      const response = await fetch('/api/fetch-weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setSessionId(data.session_id)
      
      // Start listening for progress updates
      const eventSource = new EventSource(`/api/progress/${data.session_id}`)
      eventSourceRef.current = eventSource

      eventSource.onmessage = (event) => {
        const update: ProgressUpdate = JSON.parse(event.data)
        
        switch (update.type) {
          case 'progress':
            if (update.current !== undefined && update.total !== undefined) {
              setProgress((update.current / update.total) * 100)
              setProcessedZips(update.current)
              if (update.zip_code) {
                setCurrentZip(update.zip_code)
                addLogEntry('info', `Processed ${update.zip_code} (${update.current}/${update.total})`)
              }
            }
            break
          case 'error':
            setErrorCount(prev => prev + 1)
            if (update.zip_code && update.message) {
              addLogEntry('error', `${update.zip_code}: ${update.message}`)
            }
            break
          case 'completed':
            setIsProcessing(false)
            setProgress(100)
            addLogEntry('success', update.message || 'Weather data fetching completed')
            eventSource.close()
            setActiveTab('results')
            break
        }
      }

      eventSource.onerror = () => {
        addLogEntry('error', 'Connection to server lost')
        setIsProcessing(false)
        eventSource.close()
      }

    } catch (error) {
      addLogEntry('error', `Failed to start processing: ${error}`)
      setIsProcessing(false)
    }
  }

  const stopProcessing = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    setIsProcessing(false)
    addLogEntry('info', 'Processing stopped by user')
  }

  const downloadCSV = async () => {
    if (!sessionId) return

    try {
      const response = await fetch(`/api/download/${sessionId}`)
      if (!response.ok) throw new Error('Download failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `weather-data-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      addLogEntry('success', 'CSV file downloaded successfully')
    } catch (error) {
      addLogEntry('error', `Download failed: ${error}`)
    }
  }

  const previewData = async () => {
    if (!sessionId) return

    try {
      const response = await fetch(`/api/preview/${sessionId}`)
      if (!response.ok) throw new Error('Preview failed')

      const data = await response.json()
      setWeatherData(data.data)
      addLogEntry('info', `Loaded preview of ${data.preview_count} results (${data.total_results} total)`)
    } catch (error) {
      addLogEntry('error', `Preview failed: ${error}`)
    }
  }

  const handleStateToggle = (stateCode: string) => {
    setSelectedStates(prev => 
      prev.includes(stateCode) 
        ? prev.filter(s => s !== stateCode)
        : [...prev, stateCode]
    )
  }

  const selectAllStates = () => {
    setSelectedStates(Object.keys(US_STATES_ZIP_COUNTS))
  }

  const clearAllStates = () => {
    setSelectedStates([])
  }

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cloud className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">US Weather Data Fetcher</h1>
          </div>
          <p className="text-lg text-gray-600">
            Fetch weather data for all ZIP codes in the continental United States
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  API Configuration
                </CardTitle>
                <CardDescription>
                  Enter your OpenWeatherMap API key to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      OpenWeatherMap API Key
                    </label>
                    <Input
                      type="password"
                      placeholder="Enter your API key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="font-mono"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Get your free API key at{' '}
                      <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        openweathermap.org
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  ZIP Code Selection
                </CardTitle>
                <CardDescription>
                  Choose between custom ZIP codes or select entire states
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="states" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="states">Select States</TabsTrigger>
                    <TabsTrigger value="custom">Custom ZIP Codes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="states" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={selectAllStates}>
                          Select All
                        </Button>
                        <Button variant="outline" size="sm" onClick={clearAllStates}>
                          Clear All
                        </Button>
                      </div>
                      <Badge variant="secondary">
                        {selectedStates.length} states selected ({getTotalZipCount().toLocaleString()} ZIP codes)
                      </Badge>
                    </div>

                    <ScrollArea className="h-64 border rounded-md p-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.entries(US_STATES_ZIP_COUNTS).map(([code, count]) => (
                          <div key={code} className="flex items-center space-x-2">
                            <Checkbox
                              id={code}
                              checked={selectedStates.includes(code)}
                              onCheckedChange={() => handleStateToggle(code)}
                            />
                            <label htmlFor={code} className="text-sm font-medium cursor-pointer">
                              {code} ({count.toLocaleString()})
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="custom" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        ZIP Codes (one per line)
                      </label>
                      <Textarea
                        placeholder="10001&#10;90210&#10;60601&#10;33101&#10;02101"
                        value={customZipCodes}
                        onChange={(e) => setCustomZipCodes(e.target.value)}
                        className="min-h-32 font-mono"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter one ZIP code per line. Only 5-digit US ZIP codes are supported.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Ready to Start</h3>
                    <p className="text-sm text-gray-600">
                      {getTotalZipCount() > 0 || customZipCodes.trim() 
                        ? `Will process ${customZipCodes.trim() ? customZipCodes.split('\n').filter(z => z.trim()).length : getTotalZipCount().toLocaleString()} ZIP codes`
                        : 'Select states or enter ZIP codes to continue'
                      }
                    </p>
                  </div>
                  <Button 
                    onClick={startWeatherFetching}
                    disabled={isProcessing || !apiKey.trim() || (selectedStates.length === 0 && !customZipCodes.trim())}
                    className="flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Start Fetching Weather
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Processing Progress
                </CardTitle>
                <CardDescription>
                  Real-time updates on weather data fetching
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{processedZips.toLocaleString()} / {totalZips.toLocaleString()} ZIP codes</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{Math.round(progress)}% complete</span>
                    <span>{errorCount} errors</span>
                  </div>
                </div>

                {currentZip && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Currently processing: {currentZip}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{processedZips.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Processed</div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                    <div className="text-sm text-gray-600">Errors</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{Math.round(progress)}%</div>
                    <div className="text-sm text-gray-600">Complete</div>
                  </div>
                </div>

                {isProcessing && (
                  <Button 
                    variant="destructive" 
                    onClick={stopProcessing}
                    className="w-full flex items-center gap-2"
                  >
                    <Square className="h-4 w-4" />
                    Stop Processing
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Results & Download
                </CardTitle>
                <CardDescription>
                  Preview and download your weather data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button onClick={previewData} variant="outline" disabled={!sessionId}>
                    Preview Data
                  </Button>
                  <Button onClick={downloadCSV} disabled={!sessionId} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download CSV
                  </Button>
                </div>

                {weatherData.length > 0 && (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ZIP Code</TableHead>
                          <TableHead>City</TableHead>
                          <TableHead>Temperature (°F)</TableHead>
                          <TableHead>Humidity (%)</TableHead>
                          <TableHead>Weather</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {weatherData.slice(0, 5).map((data, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono">{data.zip_code}</TableCell>
                            <TableCell>{data.city}</TableCell>
                            <TableCell>{data.temp_f}°F</TableCell>
                            <TableCell>{data.humidity}%</TableCell>
                            <TableCell className="capitalize">{data.weather_description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
                <CardDescription>
                  Detailed log of all processing activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {activityLog.map((entry, index) => (
                      <div key={index} className="flex items-start gap-3 p-2 rounded-lg bg-gray-50">
                        <div className="flex-shrink-0 mt-0.5">
                          {entry.type === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
                          {entry.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {entry.type === 'info' && <Clock className="h-4 w-4 text-blue-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-mono">{entry.timestamp}</span>
                            <Badge variant={entry.type === 'error' ? 'destructive' : entry.type === 'success' ? 'default' : 'secondary'} className="text-xs">
                              {entry.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">{entry.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}