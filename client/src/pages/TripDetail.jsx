import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { tripApi } from '../api'
import Hero from '../components/Hero'
import { format } from 'date-fns'
import PaymentForm from '../components/PaymentForm'

function TripDetail() {
    const {id} = useParams()
    const navigate = useNavigate()
    const [trip, setTrip] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [guests, setGuests] = useState(1)
    const [showPayment, setShowPayment] = useState(false)
    
    useEffect(()=>{
        const loadTrip = async () => {
            try{
                const data = await tripApi.getById(id)
                console.log('TripDetail API Response:', JSON.stringify(data, null, 2));
                
                // Process images
                let processedImages = [];
                if (data.images) {
                    if (Array.isArray(data.images)) {
                        processedImages = data.images;
                    } else if (typeof data.images === 'string') {
                        processedImages = [data.images];
                    } else if (typeof data.images === 'object') {
                        processedImages = Object.values(data.images);
                    }
                }
                
                // Log processed images
                console.log('Processed images:', {
                    original: data.images,
                    processed: processedImages,
                    type: typeof data.images,
                    isArray: Array.isArray(data.images)
                });
                
                // Filter out invalid URLs and ensure we have at least one image
                processedImages = processedImages.filter(url => 
                    url && typeof url === 'string' && url.trim() !== ''
                );
                
                if (processedImages.length === 0) {
                    processedImages = ["https://www.shutterstock.com/image-vector/no-image-picture-available-on-600nw-2450891049.jpg"];
                }
                
                data.images = processedImages;
                setTrip(data)
                setLoading(false)
            }catch(err){
                console.error('Error loading trip:', err)
                setError(err.message)
                setLoading(false)
            }
        }
        loadTrip()
    },[id])

    const nextImage = () => {
        if (trip?.images?.length) {
            setCurrentImageIndex((prev) => (prev + 1) % trip.images.length);
        }
    };
    
    const prevImage = () => {
        if (trip?.images?.length) {
            setCurrentImageIndex((prev) => (prev - 1 + trip.images.length) % trip.images.length);
        }
    };

    const handlePaymentSuccess = () => {
        // You might want to update the trip's available capacity here
        // or show a success message
        setShowPayment(false);
        // Optionally refresh the trip data
        loadTrip();
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-4 py-4">
                <Hero />
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col gap-4 py-4">
                <Hero />
                <div className="flex justify-center items-center min-h-[400px]">
                    <p className="text-red-500">Error: {error}</p>
                </div>
            </div>
        );
    }

    if(!trip) {
        return (
            <div className="flex flex-col gap-4 py-4">
                <Hero />
                <div className="flex justify-center items-center min-h-[400px]">
                    <p className="text-gray-500">Trip not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 py-4">
            <Hero />
            <button 
                onClick={() => navigate('/trips')}
                className="flex items-center gap-2 text-primary hover:text-blue-700 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Trips
            </button>

            <div className='flex justify-between items-start'>
                <div>
                    <h1 className='text-4xl font-bold'>{trip.name}</h1>
                    <p className='text-gray-600'>{trip.location}</p>
                </div>
                <div className='flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full'>
                    <span className="text-primary font-bold">
                        {trip.date ? format(new Date(trip.date), "MMMM d, yyyy") : "Date not available"}
                    </span>
                </div>
            </div>

            {/* Image Gallery */}
            <div className='relative h-[500px] rounded-xl overflow-hidden group'>
                {trip.images && trip.images.length > 0 ? (
                    <>
                        <img 
                            src={trip.images[currentImageIndex]} 
                            alt={trip.name} 
                            className='w-full h-full object-cover' 
                            onError={(e) => {
                                console.error('Image failed to load:', {
                                    url: trip.images[currentImageIndex],
                                    index: currentImageIndex,
                                    totalImages: trip.images.length
                                });
                                e.target.onerror = null;
                                e.target.src = "https://www.shutterstock.com/image-vector/no-image-picture-available-on-600nw-2450891049.jpg";
                            }}
                        />
                        {/* Navigation Arrows */}
                        <button 
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button 
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        {/* Image Dots */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {Array.isArray(trip.images) && trip.images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-colors ${
                                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                    }`}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex justify-center items-center h-full bg-gray-100">
                        <img 
                            src="https://www.shutterstock.com/image-vector/no-image-picture-available-on-600nw-2450891049.jpg"
                            alt="No image available"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                console.error('Fallback image failed to load');
                                e.target.onerror = null;
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3ENo Image Available%3C/text%3E%3C/svg%3E";
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Main Content Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                {/* Left Column - Trip Details */}
                <div className='lg:col-span-2 space-y-8'>
                    <div className='flex flex-col gap-4'>
                        <h2 className='text-2xl font-bold'>About this trip</h2>
                        <p className='text-gray-600'>{trip.description}</p>
                    </div>

                    <div className='space-y-4'>
                        <h2 className='text-2xl font-bold'>Trip Details</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='flex items-center gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                <span>Date: {trip.date ? format(new Date(trip.date), "MMMM d, yyyy") : "Not available"}</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <span>Location: {trip.location || "Not available"}</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                <span>Duration: {trip.duration || "Not specified"}</span>
                            </div>
                            {trip.amenities && (
                                <div className='col-span-2'>
                                    <h3 className='font-semibold mb-2'>Amenities</h3>
                                    <div className='flex flex-wrap gap-2'>
                                        {trip.amenities.map((amenity, index) => (
                                            <span key={index} className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm'>
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Booking Sidebar */}
                <div className='lg:col-span-1'>
                    <div className='sticky top-4 bg-white border border-gray-200 rounded-xl p-6 shadow-sm'>
                        <h2 className='text-xl font-bold mb-4'>Book This Trip</h2>
                        <div className='space-y-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>
                                    Number of Guests
                                </label>
                                <div className='flex items-center gap-2'>
                                    <button 
                                        onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                                        className='w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100'
                                    >
                                        -
                                    </button>
                                    <span className='w-8 text-center'>{guests}</span>
                                    <button 
                                        onClick={() => setGuests(prev => prev + 1)}
                                        className='w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100'
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className='pt-4 border-t'>
                                <div className='flex justify-between items-center mb-2'>
                                    <span className='text-gray-600'>Price per person</span>
                                    <span className='font-semibold'>RWF {trip.price?.toLocaleString() || "Not available"}</span>
                                </div>
                                <div className='flex justify-between items-center mb-4'>
                                    <span className='text-gray-600'>Total</span>
                                    <span className='text-xl font-bold text-primary'>
                                        RWF {(trip.price * guests)?.toLocaleString() || "Not available"}
                                    </span>
                                </div>
                                <button 
                                    className='w-full bg-primary text-white py-3 rounded-full hover:bg-blue-600 transition-colors'
                                    onClick={() => setShowPayment(true)}
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showPayment && (
                <div className="max-w-2xl mx-auto mt-8">
                    <PaymentForm
                        amount={trip.price * guests}
                        itemType="trip"
                        itemId={trip._id}
                        onSuccess={handlePaymentSuccess}
                        onCancel={() => setShowPayment(false)}
                    />
                </div>
            )}
        </div>
    );
}

export default TripDetail