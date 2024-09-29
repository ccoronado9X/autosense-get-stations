// Type for a station
export interface ChargingStation {
    id: number
    name: string
    marker: string
    latitude: number
    longitude: number
}

// Type for error response body
export interface ErrorResponse {
    error: string
    type: string
    code: string
}
