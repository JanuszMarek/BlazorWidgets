(function () {
    // Get baseUrl from script tag data attribute or fallback to default
    var currentScript = document.currentScript || document.querySelector('script[src*="widgets.js"]');
	var baseUrl = currentScript?.getAttribute('data-baseurl') || 'http://localhost:5166';

    // Expose baseUrl globally for Blazor components
    window.blazorWidgetsBaseUrl = baseUrl;

	proxy_widget_app();
    
    widgets_loadScript('_framework/blazor.webassembly.js', runBlazor);
	//widgets_loadScript('_content/Microsoft.AspNetCore.Components.CustomElements/Microsoft.AspNetCore.Components.CustomElements.lib.module.js');

	function proxy_widget_app() {
		if (!document.querySelector('script[type="importmap"]')) {
			// Add import map BEFORE loading any scripts to redirect module imports
			const importMap = document.createElement('script');
			importMap.type = 'importmap';
			importMap.textContent = JSON.stringify({
				imports: {
					'/_content/Microsoft.AspNetCore.Components.CustomElements/': baseUrl + '/_content/Microsoft.AspNetCore.Components.CustomElements/',
					'/_framework/': baseUrl + '/_framework/',
					'/js/CustomElements/': baseUrl + '/js/CustomElements/'
				}
			});
			document.head.appendChild(importMap);
		}
	}

    function widgets_loadScript(url, callback) {
        const scriptTag = document.createElement('script');
        scriptTag.src = `${baseUrl}/${url}`;
        if (callback) {
            scriptTag.onreadystatechange = callback;
            scriptTag.onload = callback;
        }
        if (url.startsWith('_framework/')) {
            scriptTag.setAttribute('autostart', 'false');
        }
        document.body.appendChild(scriptTag);
    }

    function runBlazor() {
        Blazor.start({
            loadBootResource: function (type, name, defaultUri, integrity) {
                const url = `${baseUrl}/_framework/${name}`;
                return url;
            }
        }).then(() => {
            console.log('Blazor WebAssembly started successfully - Custom elements are ready');  
        }).catch((error) => {
            console.error('Blazor WebAssembly startup error:', error);
        });
    }
   
})();