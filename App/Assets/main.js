const taken_section = document.getElementById("alarmes_prises");
const free_section = document.getElementById("alarmes_libres");
const info_section = document.getElementById("info_section");
const datetime_section = document.getElementById("date_heure");
const add_button = document.getElementById("add_button");
const card_template = document.getElementById("user_card");
const modal = document.getElementById('modal');
const close_buttons = document.getElementsByClassName('close');
const form = document.getElementById('my_form');

const current_users = new Map();
const request = new Request("App/Modeles/UserController.php?action=fetchAll", {method: 'GET'})

let current_time = new Date();

fetch("App/Modeles/server_clock.php")
	.then(response => response.json())
	.then(data => {
		datetime_section.textContent = data.datetime;
		datetime_section.setAttribute("datetime", data.datetime);
		current_time = data.datetime;
	})
	.catch(error => {
		console.error('Error while checking time: ', error);
});

function checkUpdates()
{
	setInterval(async () => {
		fetch(request)
		.then(response => response.json())
		.then(data => compareData(data.users))
	}, 5000);
}

function compareData(data)
{
  current_users.forEach((value, key) => {
    if (data.find(user => user['id'] == key) == undefined) 
    {
		destroyCard(key);
    }
  })

  data.forEach(user => {
  	if(!current_users.has(user['id']))
  	{
  		generateCard(user)
  	}
  })
}

add_button.addEventListener('click', function() {
  modal.style.display = 'flex';
});

Array.from(close_buttons).forEach(function(button) {
  button.addEventListener('click', function() {
    modal.style.display = 'none';
  });
});

modal.addEventListener('click', function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
});

form.addEventListener('submit', function(event) {

	event.preventDefault()

	formData = new FormData(form)
	formData.append('action', 'submitUser')

	const post_request = new Request("App/Modeles/UserController.php", 
		{
			method: 'POST', 
			body: formData
		})

	fetch(post_request).
	then(response => response.json())
	.then(data => {
		if (data != null)
		{
			if(data.result.type == 'success')
			{
				modal.style.display = 'none';
				data.result['value']['id'] = data.result['last_id']
				generateCard(data.result['value']);
			}
			else
		 	{
		 		alert(data.result.type + " => " + data.result.value);
		 	}
		}
		else
		{
			console.log(data.error);
		}
	})
});

function fetchAllUsers()
{
	fetch(request)
	.then(response => response.json())
	.then(data => {
		data.users.forEach(user =>
			{
				generateCard(user);
			}
		)
	})
}

function generateCard(user)
{
	// console.log(user);
	current_users.set(parseInt(user['id']), user);
	const card_fragment = card_template.content.cloneNode(true);
	const card = document.createElement("button");
	card.className = "user-card";
	card.setAttribute('id', user['id']);
	card.appendChild(card_fragment);

	let content = card.querySelectorAll("p");
	let delete_btn = card.querySelector(".card-delete");
	content[0].textContent = user.name;
	content[1].textContent = user.surname;
	content[2].textContent = user['id'];
	delete_btn.addEventListener("click", function(event)
	{
		event.stopPropagation();
		let deleteForm = new FormData();
		deleteForm.append("id", user['id']);
		deleteForm.append("action", "delete");
		const post_request = new Request("App/Modeles/UserController.php", 
		{
			method: 'POST', 
			body: deleteForm
		})
		fetch(post_request)
		.then(response => 
		{
			if(response.ok)
			{
				destroyCard(user['id'])
				// console.log(response.result)
			}
			else
			{
				// console.log(response)
			}
		})
		.catch(error => console.log(error))

		// console.log("user is deleted")
	})
	card.addEventListener("dblclick", function()
	{
		// console.log("card dbl clicked");
		moveCard(user, card)
	});

	free_section.appendChild(card);
}

function destroyCard(id)
{
	current_users.delete(id);
	card = document.getElementById(id);
	card.remove();
}

function displayInfos(user)
{
	if(user !== "none")
	{
	    Object.keys(user).forEach((key) => {
	        if (key !== 'id') {
	            let element = document.getElementById(key);
	            if (element) {
	                element.textContent = user[key];
	            }
	            if(key == "birth_date")
	            {
	            	let ageElement = document.getElementById("age");
	            	ageElement.textContent = calculateAge(user[key]);
	            	if(calculateDaysFromBirthday(user[key]) == 0)
	            	{
	            		ageElement.style.color = "#F60000"; //rouge
	            	}
	            	else if(calculateDaysFromBirthday(user[key]) <= 7 && calculateDaysFromBirthday(user[key]) > 0)
	            	{
	            		ageElement.style.color = "#FFEC00"; //jaune
	            	}
	            	else if(calculateDaysFromBirthday(user[key]) >= -7 && calculateDaysFromBirthday(user[key]) < 0)
	            	{
	            		ageElement.style.color = "#FF6F00"; //orange
	            	}
	            	else
	            	{
	            		ageElement.style.color = "#FFFFFF"; //blanc
	            	}
	            }
	        }
	    });
	}
	else
	{
	    let elements = info_section.querySelectorAll('.info-field span');
	    elements.forEach((element) => {
	      element.textContent = '';
	    });
	}
}

function moveCard(user, card)
{
    let siblingId = taken_section.firstElementChild ? taken_section.firstElementChild.id : null;
    let sibling = siblingId ? document.getElementById(siblingId) : null;

    if(sibling) {
        switch(card.parentNode.id)
        {
            case "alarmes_libres":
                free_section.removeChild(card);
                taken_section.removeChild(sibling);
                taken_section.appendChild(card);
                free_section.appendChild(sibling);
                displayInfos(user);
                break;
            case "alarmes_prises":
            	displayInfos("none");
                taken_section.removeChild(card);
                free_section.appendChild(card);	
                break;
            default:
                break;
        }
    }
    else
    {
        if(card.parentNode.id == "alarmes_libres")
        {
            free_section.removeChild(card);
            taken_section.appendChild(card);
            displayInfos(user);
        }
    }
}

// An asynchronous function which loop every second to fetch the server current timestamp
function checkTime()
{
	setInterval(async () => {
		fetch("App/Modeles/server_clock.php")
		.then(response => response.json())
		.then(data => {
			datetime_section.textContent = data.datetime;
			datetime_section.setAttribute("datetime", data.datetime);
		})
		.catch(error => {
			console.error('Error while checking time: ', error);
		});
	}, 999)
}

function calculateAge(birth_date) {    
    birth_date = new Date(Date.parse(birth_date));
    const parsed_c_time = new Date();

    let diff = (birth_date.getTime() - parsed_c_time.getTime()) / 1000;
    diff /= (60 * 60 * 24);
    return Math.abs(Math.round(diff / 365.25));;
}

function calculateDaysFromBirthday(birth_date) {    
    birth_date = new Date(Date.parse(birth_date));
    const parsed_c_time = new Date();

    let birthday_this_year = new Date(parsed_c_time.getFullYear(), birth_date.getMonth(), birth_date.getDate());
    let diff = (birthday_this_year - parsed_c_time);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

fetchAllUsers();
checkUpdates();
checkTime();