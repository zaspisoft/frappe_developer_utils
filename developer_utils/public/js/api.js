frappe.provide("frappe.router")
function circle_component(pageType, page) {

	document.getElementById('custom-circle')?.remove()
	// Create a circular div element
	var circleDiv = document.createElement('div');
	circleDiv.id = 'custom-circle';
	circleDiv.classList.add('circle');
	circleDiv.innerHTML = 'api'

	var pencilDiv = document.createElement('div');
	pencilDiv.id = 'custom-pencil';
	pencilDiv.classList.add('pencil');
	pencilDiv.innerHTML = '<i class="fas fa-pencil-alt"></i>';



	document.body.appendChild(circleDiv);
	document.body.appendChild(pencilDiv);


	pencilDiv.addEventListener('click', async function () {

		const doc = await frappe.get_doc("DocType", page[1])

		const fields = doc.fields;

		const fieldTypeToRemove = [
			'Section Break',
			'Column Break',
			'Button',
			'HTML',
			'Fold',
			'Heading',
			'Table',
			'Table MultiSelect',
			'Tab Break'

		]

		const fieldsList = fields.filter(each => fieldTypeToRemove.indexOf(each.fieldtype) === -1).map(each => ({
			label: each.label || each.fieldname,
			fieldname: each.fieldname,
			fieldtype: 'Check'
		}))

		fieldsList.push({
			label: 'Limit',
			fieldname: 'limit_frappe_developer_utils',
			fieldtype: 'Data',
			placeholder: '*'
		})

		let d = new frappe.ui.Dialog({
			title: 'Enter details',
			fields: fieldsList,
			size: 'extra-large', // small, large, extra-large 
			primary_action_label: 'Select Fields',
			primary_action(values) {
				window.localStorage.setItem(`${page[1]}_fields`, JSON.stringify(values))
				d.hide()
			}
		});

		const fields_selected = JSON.parse(window.localStorage.getItem(`${page[1]}_fields`) || '{}')

		d.set_values(fields_selected)


		d.show()


	})

	function getFieldsFromObject(obj) {
		const fields = []
		for (const key of Object.keys(obj)) {
			if (obj.hasOwnProperty(key)) {
				const element = obj[key];
				if(element == 1) {
					fields.push(key)
				}
			}
		}
		fields.push('name')
		return fields
	}



	// Add click event listener to handle actions
	circleDiv.addEventListener('click', function () {
		if (pageType == 'Form') {
			window.open(`/api/resource/${page[1]}/${page[2]}`, "_blank")
		} else if (pageType == 'List') {
			const filters = cur_list.filter_area.get().map(each => ([each[1], each[2], each[3]]))
			const sort_order = cur_list.sort_order
			const sort_by = cur_list.sort_by

			let fields_selected = JSON.parse(window.localStorage.getItem(`${page[1]}_fields`) || '{}')

			let limit = parseInt(fields_selected['limit_frappe_developer_utils'] || '*') || '*'

			delete fields_selected['limit_frappe_developer_utils']


			const searchURL = new URL(`${window.location.origin}/api/resource/${page[1]}?fields=${JSON.stringify(getFieldsFromObject(fields_selected))}&limit=${limit}`)


			if (filters.length > 0) {
				searchURL.searchParams.append('filters', JSON.stringify(filters))
			}

			if (sort_order) {
				searchURL.searchParams.append('order_by', `${sort_by} ${sort_order}`)
			}

			window.open(decodeURIComponent(searchURL.toString()), "_blank")
		}

	});
}

const component_loader = () => {
	const page = frappe.get_route();

	// Return if page is undefined or null
	if (!page || page.length === 0) {
		document.getElementById('custom-circle')?.remove();
		return;
	}

	const pageType = page[0];
	console.log(pageType);

	if (['Form', 'List'].includes(pageType)) {
		circle_component(pageType, page);
	} else {
		document.getElementById('custom-circle')?.remove();
	}
}


frappe.router.on('change', component_loader)
component_loader()


