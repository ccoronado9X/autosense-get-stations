import { Readable } from 'stream'
import { ChargingStation } from './types'
import { isValidStation, isWithinBoundingBox } from './validation'

// Encapsulate the business logic in a class
export class StationService {
    private url: string | undefined
    private stations: ChargingStation[]
    private stationsResponse: any

    constructor(url: string | undefined) {
        this.url = url
        this.stations = []
    }

    private async streamToString(stream: Readable): Promise<string> {
        const chunks: Buffer[] = []
        for await (const chunk of stream) {
            chunks.push(chunk)
        }
        return Buffer.concat(chunks).toString('utf-8')
    }

    // Fetch stations from S3 and validate them
    public async fetchBBStations(
        latSw: number,
        lngSw: number,
        latNe: number,
        lngNe: number
    ): Promise<ChargingStation[]> {
        try {
            if (!this.url) throw new Error('No URL provided')

            this.stationsResponse = await fetch(this.url)
            if (!this.stationsResponse.ok) {
                throw new Error(
                    `There was an error obtaining the data: ${this.stationsResponse.statusText}`
                )
            }
            this.stationsResponse = await this.streamToString(
                this.stationsResponse.body
            )
            this.stations = JSON.parse(this.stationsResponse)

            // Filter and return valid stations within the bounding box
            return this.stations.filter(
                (station) =>
                    isValidStation(station) &&
                    isWithinBoundingBox(station, latSw, lngSw, latNe, lngNe)
            )
        } catch (error) {
            console.error('Error fetching stations from S3:', error)
            throw new Error('Error fetching stations from S3')
        }
    }
}
