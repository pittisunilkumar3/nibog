"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Edit, Trash, AlertTriangle, MapPin, Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getVenueById, deleteVenue } from "@/services/venueService"
import { getCityById } from "@/services/cityService"
import { useToast } from "@/components/ui/use-toast"

// Mock events data - in a real app, this would come from an API
const mockEvents = [
  {
    id: "E001",
    title: "Baby Sensory Play",
    venue: "NIBOG Stadium",
    city: "Hyderabad",
    date: "2025-04-15",
    registrations: 45,
    status: "upcoming",
  },
  {
    id: "E002",
    title: "Baby Crawling",
    venue: "NIBOG Stadium",
    city: "Hyderabad",
    date: "2025-05-20",
    registrations: 38,
    status: "upcoming",
  },
  {
    id: "E003",
    title: "Running Race",
    venue: "NIBOG Stadium",
    city: "Hyderabad",
    date: "2025-06-10",
    registrations: 52,
    status: "upcoming",
  },
]

type Props = {
  params: { id: string }
}

export default function VenueDetailPage({ params }: Props) {
  const router = useRouter()
  const { toast } = useToast()
  const venueId = parseInt(params.id)

  const [venue, setVenue] = useState<any>(null)
  const [city, setCity] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch venue data on component mount
  useEffect(() => {
    const fetchVenueData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log(`Fetching venue with ID: ${venueId}`)

        // First try to get all venues with city details and find the one we need
        // This is more reliable than the individual venue endpoint
        try {
          console.log("Trying to fetch all venues with city details...")
          const allVenuesWithCity = await fetch('/api/venues/getall-with-city').then(res => res.json())

          if (Array.isArray(allVenuesWithCity) && allVenuesWithCity.length > 0) {
            console.log(`Retrieved ${allVenuesWithCity.length} venues with city details`)

            // Find the venue with the matching ID (could be venue_id or id)
            const foundVenue = allVenuesWithCity.find(v =>
              v.venue_id === venueId ||
              v.id === venueId ||
              (v.venue_id && v.venue_id.toString() === venueId.toString()) ||
              (v.id && v.id.toString() === venueId.toString())
            )

            if (foundVenue) {
              console.log("Found venue in all venues list:", foundVenue)
              setVenue(foundVenue)

              // City data is already included in the venue data
              if (foundVenue.city_name) {
                setCity({
                  id: foundVenue.city_id,
                  city_name: foundVenue.city_name,
                  state: foundVenue.state || "",
                  is_active: foundVenue.city_is_active
                })

                // We found everything we need, so we can return early
                setIsLoading(false)
                return
              }
            }
          }
        } catch (allVenuesError) {
          console.error("Error fetching all venues with city:", allVenuesError)
          // Continue to the next approach
        }

        // If we get here, we couldn't find the venue in the all venues list
        // Try the direct API call
        try {
          // Fetch venue data from API
          const venueData = await getVenueById(venueId)
          setVenue(venueData)

          // Fetch city data if venue has a city_id
          if (venueData && venueData.city_id) {
            try {
              const cityData = await getCityById(venueData.city_id)
              setCity(cityData)
            } catch (cityError) {
              console.error("Error fetching city data:", cityError)
              // Don't set an error for city fetch failure, just log it
            }
          }
        } catch (error: any) {
          console.error("Failed to fetch venue data:", error)
          setError(error.message || "Failed to load venue. Please try again.")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchVenueData()
  }, [venueId])

  // Handle venue deletion
  const handleDeleteVenue = async () => {
    try {
      setIsDeleting(true)

      // Get the correct venue ID (could be venue_id or id)
      const actualVenueId = venue.venue_id || venue.id

      console.log(`Deleting venue with ID: ${actualVenueId}`)

      // Call the API to delete the venue
      const result = await deleteVenue(actualVenueId)

      if (result.success) {
        toast({
          title: "Success",
          description: "Venue deleted successfully",
        })

        // Redirect back to venues list
        router.push("/admin/venues")
      } else {
        throw new Error("Failed to delete venue. Please try again.")
      }
    } catch (error: any) {
      console.error("Error deleting venue:", error)

      toast({
        title: "Error",
        description: error.message || "Failed to delete venue. Please try again.",
        variant: "destructive",
      })

      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Loading venue details...</h2>
        </div>
      </div>
    )
  }

  if (error || !venue) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Venue not found</h2>
          <p className="text-muted-foreground">{error || "The venue you are looking for does not exist."}</p>
          <Button className="mt-4" onClick={() => router.push("/admin/venues")}>
            Back to Venues
          </Button>
        </div>
      </div>
    )
  }

  // Get the venue name (could be venue_name or name depending on the API response)
  const venueName = venue.venue_name || venue.name

  // Filter mock events for this venue - in a real app, you would fetch events for this venue from an API
  const venueEvents = mockEvents.filter(e => e.venue === venueName)

  // Calculate event stats - in a real app, this would come from the API
  const eventCount = venueEvents.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/venues">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{venueName}</h1>
            <p className="text-muted-foreground">{city ? city.city_name : `City ID: ${venue.city_id}`}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/venues/${venue.venue_id || venue.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Venue
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20">
                <Trash className="mr-2 h-4 w-4" />
                Delete Venue
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Venue</AlertDialogTitle>
                <AlertDialogDescription>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
                    <div className="space-y-2">
                      <div className="font-medium">This action cannot be undone.</div>
                      <div>
                        This will permanently delete the venue "{venueName}" in {city ? city.city_name : `City ID: ${venue.city_id}`} and all associated data.
                        {eventCount > 0 ? (
                          <>
                            {" "}This venue has {eventCount} event{eventCount !== 1 ? "s" : ""}.
                            Deleting it may affect existing data.
                          </>
                        ) : (
                          " This venue has no events."
                        )}
                      </div>
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600"
                  onClick={handleDeleteVenue}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Venue"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Venue Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 font-medium">Address</h3>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{venue.address}</p>
              </div>
            </div>
            <Separator />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 font-medium">City</h3>
                <p className="text-sm text-muted-foreground">{city ? city.city_name : `City ID: ${venue.city_id}`}</p>
              </div>
              <div>
                <h3 className="mb-2 font-medium">Capacity</h3>
                <p className="text-sm text-muted-foreground">{venue.capacity} participants</p>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="mb-2 font-medium">Status</h3>
              {venue.is_active || venue.venue_is_active ? (
                <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
              ) : (
                <Badge variant="outline">Inactive</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium text-muted-foreground">Total Events</h3>
              <p className="mt-2 text-2xl font-bold">{eventCount}</p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium text-muted-foreground">Upcoming Events</h3>
              <p className="mt-2 text-2xl font-bold">{Math.floor(eventCount * 0.7)}</p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium text-muted-foreground">Past Events</h3>
              <p className="mt-2 text-2xl font-bold">{Math.floor(eventCount * 0.3)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Upcoming Events</h2>
          <p className="text-muted-foreground">Events scheduled at this venue</p>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Registrations</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {venueEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No events found for this venue.
                  </TableCell>
                </TableRow>
              ) : (
                venueEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{event.date}</TableCell>
                    <TableCell>{event.registrations}</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-500 hover:bg-blue-600">Upcoming</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/events/${event.id}`}>
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
