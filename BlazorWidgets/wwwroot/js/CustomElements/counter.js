export function getCounterValue() {
	return document.getElementById('Counter').value;
}

export function onCounterClick(count) {
	console.log('Counter clicked, current count:', count);
	// Add your custom logic here
}