(function () {
    // Get baseUrl from script tag data attribute or fallback to default
    var currentScript = document.currentScript || document.querySelector('script[src*="widgets.js"]');
	var baseUrl = currentScript?.getAttribute('data-baseurl') || 'http://localhost:5238';


	proxy_widget_app();
    widgets_loadScript('_framework/blazor.webassembly.js', runBlazor);

	function proxy_widget_app() {
		if (!document.querySelector('script[type="importmap"]')) {
			// Add import map BEFORE loading any scripts to redirect module imports
			const importMap = document.createElement('script');
			importMap.type = 'importmap';
			importMap.textContent = JSON.stringify({
				imports: {
					'/_content/Microsoft.AspNetCore.Components.CustomElements/': baseUrl + '/_content/Microsoft.AspNetCore.Components.CustomElements/',
					'/_framework/': baseUrl + '/_framework/'
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
                if (type !== 'dotnetjs' && location.hostname !== 'localhost' && type !== 'configuration' && type !== 'manifest') {
                    return (async function () {
                        const response = await fetch(url + '.br', { cache: 'no-cache' });
                        if (!response.ok) {
                            throw new Error(response.statusText);
                        }
                        const originalResponseBuffer = await response.arrayBuffer();
                        const originalResponseArray = new Int8Array(originalResponseBuffer);
                        const decompressedResponseArray = BrotliDecode(originalResponseArray);
                        const contentType = type ===
                            'dotnetwasm' ? 'application/wasm' : 'application/octet-stream';
                        return new Response(decompressedResponseArray,
                            { headers: { 'content-type': contentType } });
                    })();
                } else {
                    return url;
                }
            }
        }).then(() => {
            console.log('Blazor started successfully - Widgets are ready');
        }).catch((error) => {
            console.error('Blazor startup error:', error);
        });
    }

})();