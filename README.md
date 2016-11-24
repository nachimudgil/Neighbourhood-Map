Feat: Created a single page application featuring a map of a neighbourhood I'd like to visit. Functionality was added
through placement of markers identifying popular spots, search/filter bar to find specific locations, and a list view to
support all locations.

Docs: Added a description for the project

    Description:

    Neighbourhood Map Project

    This is an interactive map application created to satisfy the requirements for project 5, which utilises materials
    and info learned from the Intro to AJAX and Javascript Design Patterns courses. It has additional functionality through
    highlighted locations, third-party data about those locations and various ways to browse the content.

    Directions for usage:

    1. Download all the files given in the zipped folder, unzip it and open the file index.html

    2. The file will load a google map rendition of the city of Sydney in Australia, with 6 data points pinned on the
       map for viewing. Markers will perform a bouncing animation when clicked on To choose locations, you can either:

        a. Clicking on a marker directly, or
        b. Clicking on an item in the list on the bottom right of the screen. The list is hidden upon loading, so
           click on the hamburger icon in the top left corner to show it; from here you can click on a location
           to show it on the map.

    3. A chosen location has a box pop up over the chosen marker, giving its location and a link to the most relevant
       website about it.

    4. The user can also filter locations by typing in the search box in the right corner of the page. Only relevant
       keywords or letters will filter out the locations, otherwise nothing will be displayed since it isn't present
       on the map.

    5. As mentioned before, when a location is chosen a box appears above it. Using Foursquare API, this box contains
       the most relevant address and a website link to a location relevant to the area, like its website or the website
       of a nearby relevant area. For some locations like Circular Quay and Sydney Tower, the Foursquare API will load
       the website of a nearby area, since these contain many places instead of simply being one themselves.

    6. A small "Powered by Foursqaure" icon is at the bottom left of the page, to acknowledge the use of its API.


### APIs and Frameworks Used
---
- Google Maps API
- Foursquare API
- HTML, CSS, JS
- JQuery
- Bootstrap
- knockout.js

### Reference

* http://you.arenot.me/2010/06/29/google-maps-api-v3-0-multiple-markers-multiple-infowindows/
* http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
* http://www.evoluted.net/thinktank/web-design/custom-google-maps-style-tool
* https://color.adobe.com/Beach-Time-color-theme-2629293/
* https://medium.com/@jrdnndtsch/drop-down-hamburger-menu-with-jquery-1ae7fa572c04#.prhyr3t6r


