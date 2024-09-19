frappe.provide("frappe.router")
function circle_component(pageType, page) {

		document.getElementById('custom-circle')?.remove()
    // Create a circular div element
    var circleDiv = document.createElement('div');
    circleDiv.id = 'custom-circle';
    circleDiv.classList.add('circle');
		circleDiv.innerHTML = 'api'
    document.body.appendChild(circleDiv);

    // Add click event listener to handle actions
    circleDiv.addEventListener('click', function() {
			if(pageType == 'Form') {
				

				window.open(`/api/resource/${page[1]}/${page[2]}`, "_blank")
			} else if (pageType == 'List') {
				const filters = cur_list.filter_area.get().map(each => ([each[1], each[2], each[3]]))
				const sort_order = cur_list.sort_order
				const sort_by = cur_list.sort_by
				const searchURL= new URL(`${window.location.origin}/api/resource/${page[1]}`)

				
				if(filters.length > 0) {
					searchURL.searchParams.append('filters', JSON.stringify(filters))
				}

				if(sort_order) {
					searchURL.searchParams.append('order_by', `${sort_by} ${sort_order}`)
				}

				window.open(decodeURIComponent(searchURL.toString()), "_blank")
			}
        
    });
}

const component_loader = () => {

	const page = frappe.get_route()

	if(!page) {
		return
	}


	if(page.length > 0) {

		const pageType = page[0]
		console.log(pageType)
		if(['Form', 'List'].indexOf(pageType) >=0) {

			circle_component(page[0], page)

		} else {
			document.getElementById('custom-circle')?.remove()

		}
	} else {
		console.log('deleting')
		document.getElementById('custom-circle')?.remove()
	}

}


frappe.router.on('change' , component_loader)
component_loader()


