var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Add HTTP client for proxying
builder.Services.AddHttpClient();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
}

// Proxy middleware for BlazorWidgets
//app.Use(async (context, next) =>
//{
//    if (context.Request.Path.StartsWithSegments("/_framework") || 
//        context.Request.Path.StartsWithSegments("/_content") ||
//        context.Request.Path.StartsWithSegments("/js/widgets.js"))
//    {
//        var httpClient = context.RequestServices.GetRequiredService<IHttpClientFactory>().CreateClient();
//        var targetUrl = $"http://localhost:5238{context.Request.Path}{context.Request.QueryString}";
        
//        var proxyResponse = await httpClient.GetAsync(targetUrl);
        
//        context.Response.StatusCode = (int)proxyResponse.StatusCode;
//        foreach (var header in proxyResponse.Headers)
//        {
//            context.Response.Headers[header.Key] = header.Value.ToArray();
//        }
//        foreach (var header in proxyResponse.Content.Headers)
//        {
//            context.Response.Headers[header.Key] = header.Value.ToArray();
//        }
        
//        await proxyResponse.Content.CopyToAsync(context.Response.Body);
//        return;
//    }
    
//    await next();
//});

app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
