using System;
using System.Net;
using System.Web;
using System.Web.Caching;
using System.IO;
using System.IO.Compression;
using System.Web.UI;
using System.Linq;
using System.Web.UI.HtmlControls;
using System.Collections.Generic;

namespace ExpenseView.Service.Util
{
    public class JSCompressionModule : IHttpModule
    {

        #region IHttpModule Members

        /// <summary>
        /// Disposes of the resources (other than memory) used by the module 
        /// that implements <see cref="T:System.Web.IHttpModule"></see>.
        /// </summary>
        void IHttpModule.Dispose()
        {
            // Nothing to dispose; 
        }

        /// <summary>
        /// Initializes a module and prepares it to handle requests.
        /// </summary>
        /// <param name="context">An <see cref="T:System.Web.HttpApplication"></see> 
        /// that provides access to the methods, properties, and events common to 
        /// all application objects within an ASP.NET application.
        /// </param>
        void IHttpModule.Init(HttpApplication context)
        {
            // For ScriptResource.axd compression
            context.BeginRequest += new EventHandler(context_BeginRequest);
            context.EndRequest += new EventHandler(context_EndRequest);
        }

        #endregion

        private const string ENCODING = "deflate";
        private const string KEY = "JSData";
        #region Compress page


        /// <summary>
        /// Checks the request headers to see if the specified
        /// encoding is accepted by the client.
        /// </summary>
        private static bool IsEncodingAccepted()
        {
            HttpContext context = HttpContext.Current;
            return context.Request.Headers["Accept-encoding"] != null && context.Request.Headers["Accept-encoding"].Contains(ENCODING);
        }


        #endregion

        #region Compress JSCompressor.axd

        /// <summary>
        /// Handles the BeginRequest event of the context control.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        void context_PreReleaseRequestState(object sender, EventArgs e)
        {
            HttpApplication app = (HttpApplication)sender;
            if (app.Context.CurrentHandler is System.Web.UI.Page && app.Request["HTTP_X_MICROSOFTAJAX"] == null)
            {
                if (IsEncodingAccepted())
                {
                    app.Response.Filter = new DeflateStream(app.Response.Filter, CompressionMode.Compress);
                    HttpContext.Current.Response.AppendHeader("Content-encoding", ENCODING);
                }
            }
        }

        /// <summary>
        /// Handles the BeginRequest event of the context control.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        private void context_BeginRequest(object sender, EventArgs e)
        {
            HttpApplication app = (HttpApplication)sender;
            if (app.Request.Path.Contains("JSMinifier.axd"))
            {
                SetCachingHeaders(app);
                app.CompleteRequest();
            }
        }

        /// <summary>
        /// Handles the EndRequest event of the context control.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        private void context_EndRequest(object sender, EventArgs e)
        {
            if ((!IsEncodingAccepted()))
            {
                return;
            }

            HttpApplication app = (HttpApplication)sender;

            if (app.Request.Path.Contains("JSMinifier.axd") && app.Context.Request.QueryString["c"] == null)
            {
                if (app.Application[KEY] == null)
                {
                    AddCompressedBytesToCache(app);
                }

                app.Context.Response.AppendHeader("Content-encoding", ENCODING);
                app.Context.Response.ContentType = "text/Javascript";
                app.Context.Response.BinaryWrite((byte[])app.Application[KEY]);
            }
        }

        /// <summary>
        /// Sets the caching headers and monitors the If-None-Match request header,
        /// to save bandwidth and CPU time.
        /// </summary>
        private static void SetCachingHeaders(HttpApplication app)
        {
            string etag = "\"" + app.Context.Request.QueryString.ToString().GetHashCode().ToString() + "\"";
            string incomingEtag = app.Request.Headers["If-None-Match"];

            app.Response.Cache.VaryByHeaders["Accept-Encoding"] = true;
            app.Response.Cache.SetOmitVaryStar(true);
            app.Response.Cache.SetExpires(DateTime.Now.AddDays(7));
            app.Response.Cache.SetCacheability(HttpCacheability.Public);
            app.Response.Cache.SetETag(etag);

            if (String.Compare(incomingEtag, etag) == 0)
            {
                app.Response.StatusCode = (int)HttpStatusCode.NotModified;
                app.Response.End();
            }
        }

        /// <summary>
        /// Adds a compressed byte array into the application items.
        /// <remarks>
        /// This is done for performance reasons so it doesn't have to
        /// create an HTTP request every time it serves the ScriptResource.axd.
        /// </remarks>
        /// </summary>
        private static void AddCompressedBytesToCache(HttpApplication app)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(app.Context.Request.Url.OriginalString + "&c=1");
            request.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;

            using (HttpWebResponse response = request.GetResponse() as HttpWebResponse)
            {
                using (MemoryStream ms = CompressResponse(response, app))
                {
                    app.Application.Add(KEY, ms.ToArray());
                }
            }
        }

        /// <summary>
        /// Compresses the response stream if the browser allows it.
        /// </summary>
        private static MemoryStream CompressResponse(HttpWebResponse response, HttpApplication app)
        {
            Stream responseStream = response.GetResponseStream();
            MemoryStream dataStream = new MemoryStream();
            StreamCopy(responseStream, dataStream);
            responseStream.Dispose();

            byte[] buffer = dataStream.ToArray();
            dataStream.Dispose();

            MemoryStream ms = new MemoryStream();
            Stream compress = ms;

            if (IsEncodingAccepted())
            {
                compress = new DeflateStream(compress, CompressionMode.Compress);
            }

            compress.Write(buffer, 0, buffer.Length);
            compress.Dispose();
            return ms;
        }

        /// <summary>
        /// Copies one stream into another.
        /// </summary>
        private static void StreamCopy(Stream input, Stream output)
        {
            byte[] buffer = new byte[2048];
            int read;
            do
            {
                read = input.Read(buffer, 0, buffer.Length);
                output.Write(buffer, 0, read);
            } while (read > 0);
        }

        #endregion
    }
}