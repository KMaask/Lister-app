function getItems()
{
	// See if items is inside localStorage
	if (localStorage.getItem("items"))
	{
		// If yes, then load the existing courses
		items = JSON.parse(localStorage.getItem("items"));
	}
	else
	{
		// Make a new array of items
		items = new Array();

		// Save into local storage
		localStorage.setItem("items", JSON.stringify(items));
	}

	return items;
}

function saveItems(items)
{
	// Save the list into localStorage
	localStorage.setItem("items", JSON.stringify(items));
}

function add()
{
	// Retrieve the entered form data
	var title = $('[name="item"]').val();
	
	// Fetch the existing items
	items = getItems();
	
	// Date
	var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();
    
    var output =(day<10 ? '0' : '') + day + '.' +
    (month<10 ? '0' : '') + month + '.' +
    d.getFullYear();
    
    // Push the new item into the existing list
	items.push({
		title: output + ' ' + title
	});
	
	// Store the new list
	saveItems(items);
	
	// Reload the page to show the new item
	window.location.reload();
}

function edit()
{
	// Retrieve the entered form data
	var id = window.location.href.split('?')[1];
	var title = $('#title').val();
	var description = $('#description').val();
	
	// Fetch the existing items
	items = getItems();
	
	// Push the new item into the existing list
	items[id] = {
		title: title,
		description: description,
	};
	
	// Store the new list
	saveItems(items);
	window.location='index.html#home';
}

function remove()
{
	// Find the requested id
	var id = window.location.href.split('?')[1];
	
	// Fetch the existing items
	items = getItems();
	console.log(items);
	
	// Remove the item from the list
	items.splice(id, 1);
	console.log(items);
	
	// Store the new list
	saveItems(items);
}

function homepage()
{
	// Fetch the existing items
	items = getItems();
	
	// Clear the list
	$('#items').find('li').remove();
	
	// Add every item to the items list
	$.each(items, function(index, item)
	{
		element = $('<li><a class="toggle" data-id="' + index + '" href="#"><h2>' + item.title + '</h2></a><a href="check.html?' + index + '"></li>');
		
		if (item.done)
		{
			element.css('opacity', .3);
		}
		
		$('#items').append(element);
	});
	
	// Let jQuery re-render our list
	$('#items').listview('refresh');
}

function view(id)
{
	
	// Fetch all the items
	items = getItems();
	
	// Find the requested item
	item = items[id];
	
	// Populate the page
	$('#title').val(item.title);
	$('#description').val(item.description);
}


function check(id){
	// Fetch all the items
	items = getItems();
	
	// Find the requested item
	item = items[id];
	
	// Populate the page
	document.getElementById("name").innerHTML = item.title.split(' ')[1];
	
	if (typeof item.description === "undefined") {
	    id = window.location.href.split('?')[1];
        window.location='view.html?' + id + '';
	} else{
	    var content = item.description.split('\n');
    	for (let i = 0; i < item.description.split('\n').length; i++) {
    	    var ul = document.getElementById("list");
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(content[i]));
            
            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.class = "chk";
            checkbox.name = "activity"
            checkbox.id = item.title.split(' ')[1] +i;
            checkbox.onClick = "save()"
            li.appendChild(checkbox);
            ul.appendChild(li);
        }
	}
	
	(function()
{
  if( window.localStorage )
  {
    if( !localStorage.getItem('firstLoad') )
    {
      localStorage['firstLoad'] = true;
      window.location.reload();
    }  
    else
      localStorage.removeItem('firstLoad');
  }
})();
	
	// save checkbox state 
    var boxes = document.querySelectorAll("input[type='checkbox']");
    console.log(boxes);
    var action = document.querySelectorAll("li");
        
    //for loading
    var name = item.title.split(' ')[1];
    console.log(name);
    for(let i = 0; i < boxes.length; i++){
        var checked = JSON.parse(localStorage.getItem(name+i));
        console.log(name+i);
        document.getElementById(name+i).checked = checked;
        var state = document.getElementById(name+i).checked = checked;
        let nr = 0;
        if(state == true) {
            nr++;
            console.log(state == true);
            
            action[i].style.border = '1px solid #38ff95';
            action[i].style.color = '#00b89c';
            console.log(nr);
        }
    }
        
    document.getElementById("save").onclick = function(){	
    	for(let i = 0; i < boxes.length; i++){
            var checkbox = document.getElementById(name+i);
            localStorage.setItem(name + i, checkbox.checked);
            $('#list').listview('refresh');
        }
    }
}

function visit(){
        id = window.location.href.split('?')[1];
        window.location='view.html?' + id + '';
    }

function back(){
        window.location='index.html#home';
    }
function reload(){
    window.location.reload();
}


function toggle(id)
{
	// Fetch all the items
	items = getItems();
	
	// Find the requested item
	item = items[id];
	
	// Toggle the status
	item.done = (item.done) ? false : true;
	
	// Write back to the item list
	items[id] = item;
	
	// Write back to the storage
	saveItems(items);
	
	// Reload the page
	window.location.reload();
}

// Listen for events
$(document).on('pagebeforeshow', '#home', function(event)
{
	homepage();
});

$(document).on('pagebeforeshow', '#check', function(event)
{
	// Retrieve the requested id from the URL
	id = window.location.href.split('?')[1];
	// Load the requrested item
	check(id);
});

$(document).on('pagebeforeshow', '#view', function(event)
{
	// Retrieve the requested id from the URL
	id = window.location.href.split('?')[1];
	
	// Load the requrested item
	view(id);
	
});

$(document).on('click', '#save', function()
{
	reload();
});

$(document).on('click', '#edit', function()
{
	edit();
});

$(document).on('click', '#remove', function()
{
	remove();
});

$(document).on('click', '.toggle', function()
{
	id = $(this).data('id');
	
	toggle(id);
});