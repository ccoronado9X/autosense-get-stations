import { ChargingStation } from './types'

// Helper function to validate latitude and longitude
export const isValidLatitude = (lat: number): boolean => lat >= -90 && lat <= 90
export const isValidLongitude = (lng: number): boolean =>
    lng >= -180 && lng <= 180

// Helper function to validate the marker format N.N.N
export const isValidMarker = (marker: string): boolean =>
    /^\d\.\d\.\d$/.test(marker)

// Helper function to validate the station object
export const isValidStation = (station: ChargingStation): boolean => {
    const { id, name, marker, latitude, longitude } = station
    if (!id || !name || !marker || !latitude || !longitude) return false
    return (
        typeof id === 'number' &&
        typeof name === 'string' &&
        isValidMarker(marker) &&
        isValidLatitude(latitude) &&
        isValidLongitude(longitude)
    )
}

// Utility function to check if a station is within a bounding box
export const isWithinBoundingBox = (
    station: ChargingStation,
    latSw: number,
    lngSw: number,
    latNe: number,
    lngNe: number
): boolean => {
    const { latitude, longitude } = station
    return (
        latitude >= latSw &&
        latitude <= latNe &&
        longitude >= lngSw &&
        longitude <= lngNe
    )
}
