// CustomCounter class for instance-specific interaction
class CustomCounter {
    constructor() {
            this.element = document.querySelector('#Counter');
    }
    
    value() {
		return parseInt(this.element.value || 0);
    }
}

// Expose to window for global access
if (typeof window !== 'undefined') {
    window.CustomCounter = new CustomCounter();
}

export { CustomCounter };
