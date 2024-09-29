import { Router, Request, Response } from 'express'
import { StationService } from './stationService'
import { createErrorResponse } from './utils'
import { isValidLatitude, isValidLongitude } from './validation'
import { ChargingStation, ErrorResponse } from './types'

const router = Router()

/**
 * Helper function to check if an error response is from ErrorResponse type
 * @param error
 * @returns boolean
 */
function isErrorResponse(error: any): error is ErrorResponse {
    return (
        typeof error === 'object' &&
        'error' in error &&
        'type' in error &&
        'code' in error &&
        typeof error.error === 'string' &&
        typeof error.type === 'string' &&
        typeof error.code === 'string'
    )
}

/**
 * GET /stations
 * Returns a list of charging stations within a bounding box
 */
router.get('/inside-bb', async (req: Request, res: Response) => {
    try {
        const { latSw, lngSw, latNe, lngNe } = req.query
        let boundingBoxStations: ChargingStation[] = []

        /**
         * In this block I'm used to validate the data that are coming from the request
         * before it enters to the service layer
         */
        // Ensure coordinates are provided and valid
        if (!latSw || !lngSw || !latNe || !lngNe) {
            throw createErrorResponse(
                'Bounding box coordinates must be provided.',
                'ValidationError',
                'ERR_MISSING_COORDINATES'
            )
        }

        const latSwNum = parseFloat(latSw as string)
        const lngSwNum = parseFloat(lngSw as string)
        const latNeNum = parseFloat(latNe as string)
        const lngNeNum = parseFloat(lngNe as string)

        // Validate that the coordinates are valid latitude/longitude values
        if (
            isNaN(latSwNum) ||
            !isValidLatitude(latSwNum) ||
            isNaN(lngSwNum) ||
            !isValidLongitude(lngSwNum) ||
            isNaN(latNeNum) ||
            !isValidLatitude(latNeNum) ||
            isNaN(lngNeNum) ||
            !isValidLongitude(lngNeNum)
        ) {
            throw createErrorResponse(
                'Invalid bounding box coordinates. Latitude must be between -90 and 90, and Longitude must be between -180 and 180.',
                'ValidationError',
                'ERR_INVALID_COORDINATES'
            )
        }

        /**
         * After validations are done, I'm calling the service layer to fetch the data
         */
        const stationService = new StationService(process.env.S3_URL)
        boundingBoxStations = await stationService.fetchBBStations(
            latSwNum,
            lngSwNum,
            latNeNum,
            lngNeNum
        )
        res.json(boundingBoxStations)
    } catch (error) {
        let response = createErrorResponse(
            'An internal server error occurred while processing the request.',
            'ServerError',
            'ERR_INTERNAL_SERVER'
        )

        if (isErrorResponse(error)) {
            console.log(error)
            response = {
                error: error.error,
                code: error.code,
                type: error.type,
            }
        }
        res.status(500).json(response)
    }
})

export default router
