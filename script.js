
/**
 * DOCUMENT LOAD
 */

//upon loadingthe document, get make API request
document.onload = getNpsMapData()

function getNpsMapData() {
    //makes API getch request to get NPS data for all 466 National Park Service sites
    //var nps_api_key = "qds1ol7rZxTkBjYfmL11kwzK1q3eY7kwxODYb7qE"
    //var url = `https://developer.nps.gov/api/v1/parks?limit=500&api_key=${nps_api_key}`
    //var url = 'https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=qds1ol7rZxTkBjYfmL11kwzK1q3eY7kwxODYb7qE'
    var url = 'https://developer.nps.gov/api/v1/thingstodo?parkCode=shen,acad&api_key=qds1ol7rZxTkBjYfmL11kwzK1q3eY7kwxODYb7qE'
    fetch(url)
        .then(function(response) {
            return response.json()
        })
        .then(function(data) {
            console.log("data", data)
            //parse data for all 466 items in order to put on map
            parseNPSData(data);

            //populate last 5 recently viewed items
            var savedSearchArray = JSON.parse(localStorage.getItem("savedSearchArray") || "[]");
            savedSearchArray = savedSearchArray.slice(0, 5);  //take just the first five items from localStorage to begin

            //make button for each item in savedSearchArray
            $.each(savedSearchArray, function(i, v){
                makeButtons(savedSearchArray[i]);    //each item in savedSearchArray goes in as park data for makeButtons()
            });
        });
}



/**
 * SEARCH BAR w/ AUTOCOMPLETE
 */

//uses jQuery UI .autocomplete() function to make dropdown autocomplete list of park names for user to choose from
 $( function() {
     //parkNames is a list of all 466 National Park Service sites including national parks, national monuments, national recreation areas, etc
    var parkNames = [
         "Abraham Lincoln Birthplace National Historical Park (abli)","Acadia National Park (acad)","Adams National Historical Park (adam)","African American Civil War Memorial (afam)","African Burial Ground National Monument (afbg)","Agate Fossil Beds National Monument (agfo)","Ala Kahakai National Historic Trail (alka)","Alagnak Wild River (alag)","Alaska Public Lands (anch)","Alcatraz Island (alca)",
         "Aleutian Islands World War II National Historic Area (aleu)","Alibates Flint Quarries National Monument (alfl)","Allegheny Portage Railroad National Historic Site (alpo)","American Memorial Park (amme)","Amistad National Recreation Area (amis)","Anacostia Park (anac)","Andersonville National Historic Site (ande)","Andrew Johnson National Historic Site (anjo)","Aniakchak National Monument & Preserve (ania)",
         "Antietam National Battlefield (anti)","Apostle Islands National Lakeshore (apis)","Appalachian National Scenic Trail (appa)","Appomattox Court House National Historical Park (apco)","Arches National Park (arch)","Arkansas Post National Memorial (arpo)","Arlington House, The Robert E. Lee Memorial (arho)","Assateague Island National Seashore (asis)","Aztec Ruins National Monument (azru)",
         "Badlands National Park (badl)","Baltimore-Washington Parkway (bawa)","Bandelier National Monument (band)","Belmont-Paul Women's Equality National Monument (bepa)","Bent's Old Fort National Historic Site (beol)","Bering Land Bridge National Preserve (bela)","Big Bend National Park (bibe)","Big Cypress National Preserve (bicy)","Big Hole National Battlefield (biho)","Big South Fork National River & Recreation Area (biso)","Big Thicket National Preserve (bith)",
         "Bighorn Canyon National Recreation Area (bica)","Birmingham Civil Rights National Monument (bicr)","Biscayne National Park (bisc)","Black Canyon Of The Gunnison National Park (blca)","Blackstone River Valley National Historical Park (blrv)","Blue Ridge Parkway (blri)","Bluestone National Scenic River (blue)","Booker T Washington National Monument (bowa)","Boston African American National Historic Site (boaf)",
         "Boston Harbor Islands National Recreation Area (boha)","Boston National Historical Park (bost)","Brices Cross Roads National Battlefield Site (brcr)","Brown v. Board of Education National Historic Site (brvb)","Bryce Canyon National Park (brca)","Buck Island Reef National Monument (buis)","Buffalo National River (buff)","Cabrillo National Monument (cabr)","California National Historic Trail (cali)","Camp Nelson National Monument (cane)",
         "Canaveral National Seashore (cana)","Cane River Creole National Historical Park (cari)","Canyon de Chelly National Monument (cach)","Canyonlands National Park (cany)","Cape Cod National Seashore (caco)","Cape Hatteras National Seashore (caha)","Cape Henry Memorial Part of Colonial National Historical Park (came)","Cape Krusenstern National Monument (cakr)","Cape Lookout National Seashore (calo)",
         "Capitol Hill Parks (cahi)","Capitol Reef National Park (care)","Captain John Smith Chesapeake National Historic Trail (cajo)","Capulin Volcano National Monument (cavo)","Carl Sandburg Home National Historic Site (carl)","Carlsbad Caverns National Park (cave)","Carter G. Woodson Home National Historic Site (cawo)","Casa Grande Ruins National Monument (cagr)","Castillo de San Marcos National Monument (casa)",
         "Castle Clinton National Monument (cacl)","Castle Mountains National Monument (camo)","Catoctin Mountain Park (cato)","Cedar Breaks National Monument (cebr)","Cedar Creek & Belle Grove National Historical Park (cebe)","Chaco Culture National Historical Park (chcu)","Chamizal National Memorial (cham)","Channel Islands National Park (chis)","Charles Pinckney National Historic Site (chpi)",
         "Charles Young Buffalo Soldiers National Monument (chyo)","Chattahoochee River National Recreation Area (chat)","Chesapeake & Ohio Canal National Historical Park (choh)","Chesapeake Bay (cbpo)","Chesapeake Bay Gateways and Watertrails Network (cbgn)","Chickamauga & Chattanooga National Military Park (chch)","Chickasaw National Recreation Area (chic)","Chiricahua National Monument (chir)","Christiansted National Historic Site (chri)",
         "City Of Rocks National Reserve (ciro)","Civil War Defenses of Washington (cwdw)","Clara Barton National Historic Site (clba)","Colonial National Historical Park (colo)","Colorado National Monument (colm)","Coltsville National Historical Park (colt)","Congaree National Park (cong)","Constitution Gardens (coga)","Coronado National Memorial (coro)","Cowpens National Battlefield (cowp)","Crater Lake National Park (crla)",
         "Craters Of The Moon National Monument & Preserve (crmo)","Cumberland Gap National Historical Park (cuga)","Cumberland Island National Seashore (cuis)","Curecanti National Recreation Area (cure)","Cuyahoga Valley National Park (cuva)","César E. Chávez National Monument (cech)","Dayton Aviation Heritage National Historical Park (daav)","De Soto National Memorial (deso)","Death Valley National Park (deva)","Delaware Water Gap National Recreation Area (dewa)",
         "Denali National Park & Preserve (dena)","Devils Postpile National Monument (depo)","Devils Tower National Monument (deto)","Dinosaur National Monument (dino)","Dry Tortugas National Park (drto)","Dwight D. Eisenhower Memorial (ddem)","Ebey's Landing National Historical Reserve (ebla)","Edgar Allan Poe National Historic Site (edal)","Effigy Mounds National Monument (efmo)","Eisenhower National Historic Site (eise)","El Camino Real de Tierra Adentro National Historic Trail (elca)",
         "El Camino Real de los Tejas National Historic Trail (elte)","El Malpais National Monument (elma)","El Morro National Monument (elmo)","Eleanor Roosevelt National Historic Site (elro)","Ellis Island Part of Statue of Liberty National Monument (elis)","Eugene O'Neill National Historic Site (euon)","Everglades National Park (ever)","Federal Hall National Memorial (feha)","Fire Island National Seashore (fiis)",
         "First Ladies National Historic Site (fila)","First State National Historical Park (frst)","Flight 93 National Memorial (flni)","Florissant Fossil Beds National Monument (flfo)","Ford's Theatre (foth)","Fort Bowie National Historic Site (fobo)","Fort Davis National Historic Site (foda)","Fort Donelson National Battlefield (fodo)","Fort Dupont Park (fodu)","Fort Foote Park (fofo)","Fort Frederica National Monument (fofr)","Fort Laramie National Historic Site (fola)",
         "Fort Larned National Historic Site (fols)","Fort Matanzas National Monument (foma)","Fort McHenry National Monument and Historic Shrine (fomc)","Fort Monroe National Monument (fomr)","Fort Necessity National Battlefield (fone)","Fort Point National Historic Site (fopo)","Fort Pulaski National Monument (fopu)","Fort Raleigh National Historic Site (fora)","Fort Scott National Historic Site (fosc)","Fort Smith National Historic Site (fosm)",
         "Fort Stanwix National Monument (fost)","Fort Sumter and Fort Moultrie National Historical Park (fosu)","Fort Union National Monument (foun)","Fort Union Trading Post National Historic Site (fous)","Fort Vancouver National Historic Site (fova)","Fort Washington Park (fowa)","Fossil Butte National Monument (fobu)","Franklin Delano Roosevelt Memorial (frde)","Frederick Douglass National Historic Site (frdo)","Frederick Law Olmsted National Historic Site (frla)",
         "Fredericksburg & Spotsylvania National Military Park (frsp)","Freedom Riders National Monument (frri)","Friendship Hill National Historic Site (frhi)","Gates Of The Arctic National Park & Preserve (gaar)","Gateway Arch National Park (jeff)","Gateway National Recreation Area (gate)","Gauley River National Recreation Area (gari)","General Grant National Memorial (gegr)","George Rogers Clark National Historical Park (gero)","George Washington Birthplace National Monument (gewa)",
         "George Washington Carver National Monument (gwca)","George Washington Memorial Parkway (gwmp)","Gettysburg National Military Park (gett)","Gila Cliff Dwellings National Monument (gicl)","Glacier Bay National Park & Preserve (glba)","Glacier National Park (glac)","Glen Canyon National Recreation Area (glca)","Glen Echo Park (glec)","Gloria Dei Church National Historic Site (glde)","Golden Gate National Recreation Area (goga)",
         "Golden Spike National Historical Park (gosp)", "Governors Island National Monument (gois)","Grand Canyon National Park (grca)","Grand Canyon-Parashant National Monument (para)","Grand Portage National Monument (grpo)","Grand Teton National Park (grte)","Grant-Kohrs Ranch National Historic Site (grko)","Great Basin National Park (grba)","Great Egg Harbor River (greg)","Great Falls Park (grfa)","Great Sand Dunes National Park & Preserve (grsa)",
         "Great Smoky Mountains National Park (grsm)","Green Springs (grsp)","Greenbelt Park (gree)","Guadalupe Mountains National Park (gumo)","Guilford Courthouse National Military Park (guco)","Gulf Islands National Seashore (guis)","Hagerman Fossil Beds National Monument (hafo)","Haleakalā National Park (hale)","Hamilton Grange National Memorial (hagr)","Hampton National Historic Site (hamp)","Harmony Hall (haha)",
         "Harpers Ferry National Historical Park (hafe)","Harriet Tubman National Historical Park (hart)","Harriet Tubman Underground Railroad National Historical Park (hatu)","Harry S Truman National Historic Site (hstr)","Hawai'i Volcanoes National Park (havo)","Herbert Hoover National Historic Site (heho)","Historic Jamestowne Part of Colonial National Historical Park (jame)","Home Of Franklin D Roosevelt National Historic Site (hofr)","Homestead National Historical Park (home)",
         "Honouliuli National Historic Site (hono)","Hopewell Culture National Historical Park (hocu)","Hopewell Furnace National Historic Site (hofu)","Horseshoe Bend National Military Park (hobe)","Hot Springs National Park (hosp)","Hovenweep National Monument (hove)","Hubbell Trading Post National Historic Site (hutr)","Ice Age Floods National Geologic Trail (iafl)","Ice Age National Scenic Trail (iatr)","Independence National Historical Park (inde)",
         "Indiana Dunes National Park (indu)","Isle Royale National Park (isro)","Iñupiat Heritage Center (inup)","James A Garfield National Historic Site (jaga)","Jean Lafitte National Historical Park and Preserve (jela)","Jewel Cave National Monument (jeca)","Jimmy Carter National Historical Park (jica)","John Day Fossil Beds National Monument (joda)","John Fitzgerald Kennedy National Historic Site (jofi)","John Muir National Historic Site (jomu)",
         "Johnstown Flood National Memorial (jofl)","Joshua Tree National Park (jotr)", "Juan Bautista de Anza National Historic Trail (juba)","Kalaupapa National Historical Park (kala)","Kaloko-Honokōhau National Historical Park (kaho)","Katahdin Woods and Waters National Monument (kaww)","Katmai National Park & Preserve (katm)","Kenai Fjords National Park (kefj)","Kenilworth Park & Aquatic Gardens (keaq)","Kennesaw Mountain National Battlefield Park (kemo)","Keweenaw National Historical Park (kewe)","Kings Mountain National Military Park (kimo)",
         "Klondike Gold Rush - Seattle Unit National Historical Park (klse)","Klondike Gold Rush National Historical Park (klgo)","Knife River Indian Villages National Historic Site (knri)","Kobuk Valley National Park (kova)","Korean War Veterans Memorial (kowa)","LBJ Memorial Grove on the Potomac (lyba)","Lake Clark National Park & Preserve (lacl)","Lake Mead National Recreation Area (lake)","Lake Meredith National Recreation Area (lamr)","Lake Roosevelt National Recreation Area (laro)","Lassen Volcanic National Park (lavo)",
         "Lava Beds National Monument (labe)","Lewis & Clark National Historic Trail (lecl)","Lewis and Clark National Historical Park (lewi)","Lincoln Boyhood National Memorial (libo)","Lincoln Home National Historic Site (liho)","Lincoln Memorial (linc)","Little Bighorn Battlefield National Monument (libi)","Little River Canyon National Preserve (liri)","Little Rock Central High School National Historic Site (chsc)","Longfellow House Washington's Headquarters National Historic Site (long)",
         "Lowell National Historical Park (lowe)","Lower Delaware National Wild and Scenic River (lode)","Lower East Side Tenement Museum National Historic Site (loea)","Lyndon B Johnson National Historical Park (lyjo)","Maggie L Walker National Historic Site (mawa)","Maine Acadian Culture (maac)","Mammoth Cave National Park (maca)","Manassas National Battlefield Park (mana)","Manhattan Project National Historical Park (mapr)","Manzanar National Historic Site (manz)",
         "Marsh - Billings - Rockefeller National Historical Park (mabi)","Martin Luther King, Jr. Memorial (mlkm)","Martin Luther King, Jr. National Historical Park (malu)","Martin Van Buren National Historic Site (mava)","Mary McLeod Bethune Council House National Historic Site (mamc)","Medgar and Myrlie Evers Home National Monument (memy)","Mesa Verde National Park (meve)","Mill Springs Battlefield National Monument (misp)","Minidoka National Historic Site (miin)",
         "Minute Man National Historical Park (mima)","Minuteman Missile National Historic Site (mimi)","Mississippi National River and Recreation Area (miss)","Missouri National Recreational River (mnrr)","Mojave National Preserve (moja)","Monocacy National Battlefield (mono)","Montezuma Castle National Monument (moca)","Moores Creek National Battlefield (mocr)","Mormon Pioneer National Historic Trail (mopi)","Morristown National Historical Park (morr)",
         "Mount Rainier National Park (mora)","Mount Rushmore National Memorial (moru)","Muir Woods National Monument (muwo)","Natchez National Historical Park (natc)","Natchez Trace National Scenic Trail (natt)","Natchez Trace Parkway (natr)","National Capital Parks-East (nace)","National Mall and Memorial Parks (nama)","National Park of American Samoa (npsa)","National Parks of New York Harbor (npnh)","Natural Bridges National Monument (nabr)",
         "Navajo National Monument (nava)","New Bedford Whaling National Historical Park (nebe)","New England National Scenic Trail (neen)","New Jersey Pinelands National Reserve (pine)","New Orleans Jazz National Historical Park (jazz)","New River Gorge National Park and Preserve (neri)","Nez Perce National Historical Park (nepe)","Nicodemus National Historic Site (nico)","Ninety Six National Historic Site (nisi)",
         "Niobrara National Scenic River (niob)","Noatak National Preserve (noat)","North Cascades National Park (noca)","North Country National Scenic Trail (noco)","Obed Wild & Scenic River (obed)","Ocmulgee Mounds National Historical Park (ocmu)","Oklahoma City National Memorial (okci)","Old Spanish National Historic Trail (olsp)","Olympic National Park (olym)","Oregon Caves National Monument & Preserve (orca)","Oregon National Historic Trail (oreg)",
         "Organ Pipe Cactus National Monument (orpi)","Overmountain Victory National Historic Trail (ovvi)","Oxon Cove Park & Oxon Hill Farm (oxhi)","Ozark National Scenic Riverways (ozar)","Padre Island National Seashore (pais)","Palo Alto Battlefield National Historical Park (paal)","Paterson Great Falls National Historical Park (pagr)","Pea Ridge National Military Park (peri)","Pearl Harbor National Memorial (valr)",
         "Pecos National Historical Park (peco)","Pennsylvania Avenue (paav)","Perry's Victory & International Peace Memorial (pevi)","Petersburg National Battlefield (pete)","Petrified Forest National Park (pefo)","Petroglyph National Monument (petr)","Pictured Rocks National Lakeshore (piro)","Pinnacles National Park (pinn)","Pipe Spring National Monument (pisp)","Pipestone National Monument (pipe)","Piscataway Park (pisc)",
         "Point Reyes National Seashore (pore)","Pony Express National Historic Trail (poex)","Port Chicago Naval Magazine National Memorial (poch)","Potomac Heritage National Scenic Trail (pohe)","Poverty Point National Monument (popo)","President William Jefferson Clinton Birthplace Home National Historic Site (wicl)","President's Park (White House) (whho)","Presidio of San Francisco (prsf)","Prince William Forest Park (prwi)",
         "Pu`ukoholā Heiau National Historic Site (puhe)","Pullman National Monument (pull)","Puʻuhonua o Hōnaunau National Historical Park (puho)","Rainbow Bridge National Monument (rabr)","Reconstruction Era National Historical Park (reer)","Redwood National and State Parks (redw)","Richmond National Battlefield Park (rich)","Rio Grande Wild & Scenic River (rigr)","River Raisin National Battlefield Park (rira)",
         "Rock Creek Park (rocr)","Rocky Mountain National Park (romo)","Roger Williams National Memorial (rowi)","Roosevelt Campobello International Park (roca)","Rosie the Riveter WWII Home Front National Historical Park (rori)","Russell Cave National Monument (ruca)","Sagamore Hill National Historic Site (sahi)","Saguaro National Park (sagu)","Saint Croix Island International Historic Site (sacr)","Saint Croix National Scenic Riverway (sacn)","Saint Paul's Church National Historic Site (sapa)",
         "Saint-Gaudens National Historical Park (saga)","Salem Maritime National Historic Site (sama)","Salinas Pueblo Missions National Monument (sapu)","Salt River Bay National Historical Park and Ecological Preserve (sari)","San Antonio Missions National Historical Park (saan)","San Francisco Maritime National Historical Park (safr)","San Juan Island National Historical Park (sajh)","San Juan National Historic Site (saju)","Sand Creek Massacre National Historic Site (sand)",
         "Santa Fe National Historic Trail (safe)","Santa Monica Mountains National Recreation Area (samo)","Saratoga National Historical Park (sara)","Saugus Iron Works National Historic Site (sair)","Scotts Bluff National Monument (scbl)","Selma To Montgomery National Historic Trail (semo)","Sequoia & Kings Canyon National Parks (seki)","Shenandoah National Park (shen)","Shiloh National Military Park (shil)","Sitka National Historical Park (sitk)",
         "Sleeping Bear Dunes National Lakeshore (slbe)","Springfield Armory National Historic Site (spar)","Star-Spangled Banner National Historic Trail (stsp)","Statue Of Liberty National Monument (stli)","Ste. Geneviève National Historical Park (stge)","Steamtown National Historic Site (stea)","Stones River National Battlefield (stri)","Stonewall National Monument (ston)","Sunset Crater Volcano National Monument (sucr)","Tallgrass Prairie National Preserve (tapr)",
         "Thaddeus Kosciuszko National Memorial (thko)","Theodore Roosevelt Birthplace National Historic Site (thrb)","Theodore Roosevelt Inaugural National Historic Site (thri)","Theodore Roosevelt Island (this)","Theodore Roosevelt National Park (thro)","Thomas Cole National Historic Site (thco)","Thomas Edison National Historical Park (edis)","Thomas Jefferson Memorial (thje)","Thomas Stone National Historic Site (thst)","Timpanogos Cave National Monument (tica)",
         "Timucuan Ecological & Historic Preserve (timu)","Tonto National Monument (tont)","Touro Synagogue National Historic Site (tosy)","Trail Of Tears National Historic Trail (trte)","Tule Lake National Monument (tule)","Tule Springs Fossil Beds National Monument (tusk)","Tumacácori National Historical Park (tuma)","Tupelo National Battlefield (tupe)","Tuskegee Airmen National Historic Site (tuai)","Tuskegee Institute National Historic Site (tuin)",
         "Tuzigoot National Monument (tuzi)","Ulysses S Grant National Historic Site (ulsg)","Upper Delaware Scenic & Recreational River (upde)","Valles Caldera National Preserve (vall)","Valley Forge National Historical Park (vafo)","Vanderbilt Mansion National Historic Site (vama)","Vicksburg National Military Park (vick)","Vietnam Veterans Memorial (vive)","Virgin Islands Coral Reef National Monument (vicr)",
         "Virgin Islands National Park (viis)","Voyageurs National Park (voya)","Waco Mammoth National Monument (waco)","Walnut Canyon National Monument (waca)","War In The Pacific National Historical Park (wapa)","Washington Monument (wamo)","Washington-Rochambeau Revolutionary Route National Historic Trail (waro)","Washita Battlefield National Historic Site (waba)","Weir Farm National Historical Park (wefa)","Whiskeytown National Recreation Area (whis)",
         "White Sands National Park (whsa)","Whitman Mission National Historic Site (whmi)","William Howard Taft National Historic Site (wiho)","Wilson's Creek National Battlefield (wicr)","Wind Cave National Park (wica)","Wing Luke Museum Affiliated Area (wing)","Wolf Trap National Park for the Performing Arts (wotr)","Women's Rights National Historical Park (wori)","World War II Memorial (wwii)","Wrangell - St Elias National Park & Preserve (wrst)","Wright Brothers National Memorial (wrbr)",
         "Wupatki National Monument (wupa)","Yellowstone National Park (yell)","Yorktown Battlefield Part of Colonial National Historical Park (york)","Yosemite National Park (yose)","Yucca House National Monument (yuho)","Yukon - Charley Rivers National Preserve (yuch)","Zion National Park (zion)"
    ];
    $( "#tags" ).autocomplete({    //fills #tags ID with parkNames items
      source: parkNames
    })
  });



/**
 * FUNCTIONS
 */  

function makeSiteInfoHTML(){
    //draws HTML inside site info section. Not there when page first loads
    $("#site-info-box").append(
        "<div id='site-info'>" +
            "<article>" +
                "<p>Name:<span class='info-item' id='park-name'></span></p>" +
            "</article>" +
            "<article>" +
                "<p>Designation:<span class='info-item' id='designation'></span></p>" +
            "</article>" +
            "<article>" +
                "<p>Description:<span class='info-item' id='description'></span></p>" +
            "</article>" +
            "<article>" +
                "<p>Entrance Fee:<span class='info-item' id='entrance-fee'></span></p>" +
            "</article>" +
            "<article>" +
                "<p>Activities:<span class='info-item' id='activities'></span></p>" +
            "</article>" +
            "<article id='park-img'>" +
                "<img id='img-link'>" +
            "</article>" +
        "</div>"
    )
}



function getNpsData(uniqueParkCode){
    // makes api call using unique park code to fetch data about a specific park

    url = `https://developer.nps.gov/api/v1/parks?parkCode=${uniqueParkCode}&api_key=4eqRjnFCnxWx7DY3KDrv1DW73hwKeHabImKsqdEi`;

    fetch(url)
    .then(function (response){
        return response.json();
    })
    .then(function(results){       

        //remove HTML for site information fields if it already exists (otherwise it just adds more)
        $('#site-info').remove();

        //make HTML for site information fields
        makeSiteInfoHTML();

        //fill data for respective park into HTML of page
        var parkData = fillNPSData(results);   //returns array of park code + park name ex: ['shen', 'Shenandoah National Park']

        //Saves parkData to local storage in an array of arrays
        var alreadyExists = saveToLocalStorage(parkData);

        // if site does not already exists in 'recently viewed sites'...
        if (alreadyExists == false) {
            //make html button for new 'recent search' item
            makeButtons(parkData);
        }
        
        var siteInfo = document.getElementById("site-info");
        
        if(siteInfo) {
            //Scroll to site info
            siteInfo.scrollIntoView();
        }
    });
};


function makeButtons(parkData) {
    //makes html button in 'recently viewed sites' section, containing name of saved search
    //parkData contains an array of park code and park name ['shen', 'Shenandoah National Park']

    $('#saved-searches').append(
        `<button class='saved-search-button' type='button' data-parkcode=${parkData[0]}> ${parkData[1]}` +
            "<i class = 'fas fa-search'></i>" +
        "</button> "
    );
}



function saveToLocalStorage(parkData) {
    //saves current site into local storage in item 'savedSearchArray'

    //gets 'savedSearchArray' from local storage. If nothing exists, return empty array
    var savedSearchArray = JSON.parse(localStorage.getItem("savedSearchArray") || "[]");

    var alreadyExists = true;

    //if localStorage does not contain this site...
    if (checkContains(savedSearchArray, parkData) == false) {
        alreadyExists = false;
        savedSearchArray.unshift(parkData);  //add item to front of savedSearchArray
    }   

    //set parkData to localStorage
    localStorage.setItem("savedSearchArray", JSON.stringify(savedSearchArray));

    return alreadyExists;   //returns this value to determine if button needs to be added to 'recently viewed sites'
}


//checks if localStorage contains this site already (try to adapt arrow function to traditional function syntax)
var checkContains = (parent, child) => parent.some(arr => JSON.stringify(arr) === JSON.stringify(child));



function fillNPSData(npsData) {
    //takes NPS data returned from API request and fills HTML of page
    
    //selectors for elements to fill on HTML page
    var parkName = $('#park-name');
    var parkDesignation = $('#designation');
    var parkDescription = $('#description');
    var parkFee = $('#entrance-fee');
    var parkActivities = $('#activities');
    var parkImg = $('#img-link');
    var parkCode = npsData.data[0].parkCode;

    parkName.text(" " + npsData.data[0].fullName);                      //sets parkName  ex: Shenandoah National Park   
    parkDesignation.text(" " + npsData.data[0].designation);            //sets parkDesignation  ex: National Park
    parkDescription.text(" " + npsData.data[0].description);            //sets parkDescription  ex: "Big enough to be overwhelming, Black Canyon of the Gunnison..."
    parkFee.text(" " + "$" + npsData.data[0].entranceFees[0].cost);     //sets entranceFee  ex: $20.00


    // pushes activities into an array
    var activitiesText = [];                                            //gets all activities and adds them to array  ex: [hiking, cycling, camping]
    var allActivities = npsData.data[0].activities;
    for (var i=0; i < allActivities.length; i ++){
        //gets text of the object and pushes into the array
        activitiesText.push(" " + allActivities[i].name);
    }
    //sets text to the webpage
    parkActivities.text(activitiesText);                                //sets all activities ex: [hiking, cycling, camping]

    parkImg.attr("src" , npsData.data[0].images[0].url);                //sets parkImg. Sets image URL as src attribute of img tag. Just uses first image from available images

    return [parkCode, npsData.data[0].fullName];                        //ex: ['shen', 'Shenandoah National Park']
}



function parseNPSData(npsData) {
    //parses data for all 466 NPS sites to display in map upon initial page load

    npsData = npsData.data;                                      //data property holds actual information about sites

    var parsedDataArray = [];

    for (var i = 0; i < npsData.length; i++) {
        //get all unique designation values 
        var dataPackage = [];

        var name = npsData[i].fullName;
        var parkCode = npsData[i].parkCode;
        var lat = npsData[i].latitude;
        var lon = npsData[i].longitude;
        var designation = npsData[i].designation;
        
        //add items to dataPackage
        dataPackage.push(name, parkCode, lat, lon, designation);  //packages info for each park into array ex: ['Zion National Park', 'zion', 36.457, -81.432, 'National Park']
        //add dataPackage to parsedDataArray
        parsedDataArray.push(dataPackage);                        //adds dataPackage to parsedDataArray
    }
    //draw markers on map
    drawMapMarkers(parsedDataArray);                              //uses parsedDataArray to draw markers on map
}



/**
 * LEAFLET MAP
 */

function drawMapMarkers(markerData) {
    /**
     * Draws map markers on leaflet map 
     * 
     * green marker for National Parks
     * violet marker for National Monuments
     * red marker for National Historic Sites
     * gold marker for National Recreation Area
     * blue marker for any other designation
     * 
     * popups are associated with each marker and allow user to click to see more information
     */

    //markerData[i][2], markerData[i][3] contain latitude, longitude of each site
    for (var i = 0; i < markerData.length; i++) {
        if (markerData[i][4] == 'National Park') {
            var marker = L.marker([markerData[i][2], markerData[i][3]], {icon: greenIcon}).addTo(map); 
            marker.bindPopup(`<div id="popup">${markerData[i][0]}</div><br><button class="popup-button" data-parkcode=${markerData[i][1]}>View More</button>`);          
        } else if (markerData[i][4] == 'National Monument') {
            var marker = L.marker([markerData[i][2], markerData[i][3]], {icon: violetIcon}).addTo(map);
            marker.bindPopup(`<div id="popup">${markerData[i][0]}</div><br><button class="popup-button" data-parkcode=${markerData[i][1]}>View More</button>`);
        } else if (markerData[i][4] == 'National Historic Site') {
            var marker = L.marker([markerData[i][2], markerData[i][3]], {icon: redIcon}).addTo(map);
            marker.bindPopup(`<div id="popup">${markerData[i][0]}</div><br><button class="popup-button" data-parkcode=${markerData[i][1]}>View More</button>`);
        } else if (markerData[i][4] == 'National Recreation Area') {
            var marker = L.marker([markerData[i][2], markerData[i][3]], {icon: goldIcon}).addTo(map);
            marker.bindPopup(`<div id="popup">${markerData[i][0]}</div><br><button class="popup-button" data-parkcode=${markerData[i][1]}>View More</button>`);           
        } else {
            var marker = L.marker([markerData[i][2], markerData[i][3]]).addTo(map);
            marker.bindPopup(`<div id="popup">${markerData[i][0]}</div><br><button class="popup-button" data-parkcode=${markerData[i][1]}>View More</button>`);           
        }
    }
}



//set up styling for markers

// green marker will be used for national parks
var greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
// violet marker will be used for national monuments
var violetIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
// red marker will be used for national historic sites
var redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
// gold marker will be used for national recreation areas
var goldIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });



//set initial view of map
var map = L.map('mapid').setView([37.697948, -97.314835], 4);  //sets initial location over middle of country at zoom level 4

//link to Leaflet tile layer
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 20,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiZXB1cnB1ciIsImEiOiJja24wYXlkZnEwbTNqMm9tbGdoM3R1OXE0In0.TCaPhnKXLVLFpJeUS1AKJQ'
}).addTo(map);

//upon clicking marker, map zooms to zoom level 7. This code is straight from leaflet docs
map.on('popupopen', function(centerMarker) {
    const zoomLvl = 7;
    let cM = map.project(centerMarker.popup._latlng);
  
    cM.y -= centerMarker.popup._container.clientHeight / zoomLvl
    map.setView(map.unproject(cM), zoomLvl, {animate: true});
  });

//draw NPS boundaries on map using ESRI leaflet feature service
const npsBoundaries = L.esri.featureLayer({
    url: 'https://services1.arcgis.com/fBc8EJBxQRMcHlei/ArcGIS/rest/services/National_Park_Service_Boundaries/FeatureServer/0',
    style: function (feature) {
        return { color: 'gray'};
    }
  }).addTo(map);


  
/**
 * BUTTONS
 */

//Event Listener for our 'View More' button in the map marker
//Will use the data-parkCode attribute to make a an API request for that site
$(document).on("click", ".popup-button" , function() {
    var uniqueParkCode = $(this).data('parkcode');

    //make API call using parkCode as input. parkCode needed to make API call for specific park data
    getNpsData(uniqueParkCode);
});



//search Button at top of page. This controls the search box w/ autocomplete
$('#searchButton').click(function(event) {
    var fullParkName = $('#tags').val();                                    //gets value of full park name of input ex: 'Zion National Park (zion)'
    var stringArray = fullParkName.split(' (');                                  //splits fullParkName on ' (' left with array ex: ['Zion National Park', 'zion)']. Still have annoying remaining parenthesis
    var uniqueParkCode = stringArray[1].substring(0, stringArray[1].length - 1)   //takes index 1 item and removes final parenthesis, leaving just the park code ex: 'zion'

    //make API call using parkCode as input. parkCode needed to make API call for specific park data
    getNpsData(uniqueParkCode);
});



//each 'recently viewed' item is a button and when clicked, fetches data for that site
$(document).on("click", ".saved-search-button", function() {

    //gets data-parkcode attribute
    var uniqueParkCode = $(this).data('parkcode');

    // get stored park codes from array and pass through getNpsData api
    getNpsData(uniqueParkCode);

});

