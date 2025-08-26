# https://Jo4.co.za/

A multi-page website for JO4 featuring cybersecurity consulting, mobile coffee services, and real estate listings.

## Website Structure

- Home (/) - Brand hub page
- About (/about) - Personal profile
- JO4 SECURE (/secure) - Cybersecurity portfolio
- JO4 Brew (/brew) - Mobile coffee trailer booking
- Real Estate (/realestate) - Property listings
- Contact (/contact) - Central contact hub

## Deployment Instructions

### Prerequisites

- Web hosting service (Netlify, Vercel, or traditional hosting)
- Domain name (jo4.co.za)

### Deployment Steps

1. **Upload Files**: Upload all files to your web hosting service
   - For Netlify/Vercel: Connect to your GitHub repository
   - For traditional hosting: Upload via FTP

2. **Configure Domain**:
   - Point your domain (jo4.co.za) to your hosting service
   - Set up HTTPS certificate

3. **Test Website**:
   - Verify all pages load correctly
   - Test forms and functionality
   - Check mobile responsiveness

## Updating Website Content

### Updating Property Listings

Property listings are stored in `assets/data/listings.json`. To update:

1. Open `assets/data/listings.json`
2. Follow the existing format to add, modify, or remove listings:

```json
{
  "listings": [
    {
      "id": "property-1",
      "title": "3 Bedroom Family Home",
      "price": "R1,950,000",
      "location": "Cape Town, South Africa",
      "bedrooms": 3,
      "bathrooms": 2,
      "garages": 2,
      "area": 180,
      "description": "Beautiful family home with mountain views...",
      "features": ["Pool", "Garden", "Security"],
      "images": [
        "assets/images/realestate/property1-1.jpg",
        "assets/images/realestate/property1-2.jpg"
      ],
      "featured": true
    }
  ]
}
```

### Alternative: Google Sheets Integration

For easier updating, you can use Google Sheets:

1. Create a Google Sheet with property listing data
2. Publish the sheet to the web
3. In `assets/js/listings.js`, update the sheet URL
4. The website will now pull data from your Google Sheet

### Updating Brew Booking Calendar

To update availability for JO4 Brew bookings:

1. Edit the availability data in `assets/js/booking-calendar.js`
2. Alternatively, connect to Google Calendar via the instructions in the file comments

## Form Handling

All contact and booking forms submit to a serverless function which forwards to your email. To change the destination email:

1. Open `assets/js/form-handler.js`
2. Update the `FORM_DESTINATION_EMAIL` variable

## Maintenance

- Regularly update images in the `assets/images` directory
- Check form submissions are working correctly
- Update any PDF documents as needed

## Technical Details

This website uses:
- HTML5
- CSS3 (with CSS variables for theming)
- Vanilla JavaScript (ES6+)
- JSON for data storage
- Serverless functions for form processing

No build process is required as this is a purely static website.
