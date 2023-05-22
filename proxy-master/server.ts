import { serve } from "https://deno.land/std@0.148.0/http/server.ts";

const port = 3000;

function copyHeader(headerName: string, to: Headers, from: Headers) {
    const hdrVal = from.get(headerName);
    if (hdrVal) {
        to.set(headerName, hdrVal);
    }
}

const handler = async (request: Request): Promise<Response> => {
    // if options send do CORS preflight
    if (request.method === "OPTIONS") {
        const response = new Response("", {
            status: 200,
            headers: new Headers({
                "Access-Control-Allow-Origin":
                    request.headers.get("origin") || "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers":
                    "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-goog-visitor-id, x-origin, Accept-Language, Range, Referer, x-uid",
                "Access-Control-Max-Age": "86400",
                "Access-Control-Allow-Credentials": "true",
            }),
        });
        return response;
    }
    if (request.method === "GET") {
        if (request.url.split("/")[3] === "images") {
            const uid = request.url.split("/").pop();
            const image = await fetch("http://34.131.197.143/images/" + uid, {
                method: request.method,
                headers: request.headers,
            });
            const headers = new Headers(image.headers);
            return new Response(image.body, {
                status: image.status,
                headers: headers,
            });
        }
        return new Response("Not Found", {
            status: 404,
            headers: new Headers({
                "Access-Control-Allow-Origin":
                    request.headers.get("origin") || "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers":
                    "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-goog-visitor-id, x-origin, Accept-Language, Range, Referer, x-uid",
                "Access-Control-Max-Age": "86400",
            }),
        });
    }
    const cloned = await request.clone();
    const secondClone = await cloned.clone();
    let body;

    if (!cloned.headers.get("x-uid")) {
        body = await cloned.json();
    } else {
        const formdata = await cloned.formData();
        console.log(formdata);
        body = Object.fromEntries(formdata);
    }

    const url = new URL(`http://34.131.197.143${body.endpoint}`);
    delete body.endpoint;
    console.log(body);
    // Copy headers from the request to the new request
    const request_headers = new Headers(request.headers);

    copyHeader("range", request_headers, request.headers);
    !request_headers.has("user-agent") &&
        copyHeader("user-agent", request_headers, request.headers);
    console.log(request_headers);
    const formHead = new Headers();
    copyHeader("authorization", formHead, request.headers);
    copyHeader("x-uid", formHead, request.headers);
    // Make the request to YouTube
    const fetchRes = await fetch(url, {
        method: request.method,
        headers: !cloned.headers.get("x-uid")
            ? new Headers(request_headers)
            : formHead,
        body: !cloned.headers.get("x-uid")
            ? JSON.stringify(body)
            : await secondClone.formData(),
    });

    const headers = new Headers();
    // Construct the return headers

    // copy content headers
    copyHeader("content-length", headers, fetchRes.headers);
    copyHeader("content-type", headers, fetchRes.headers);
    copyHeader("content-disposition", headers, fetchRes.headers);
    copyHeader("accept-ranges", headers, fetchRes.headers);
    copyHeader("content-range", headers, fetchRes.headers);

    // add cors headers
    headers.set(
        "Access-Control-Allow-Origin",
        request.headers.get("origin") || "*",
    );
    headers.set("Access-Control-Allow-Headers", "*");
    headers.set("Access-Control-Allow-Methods", "*");
    headers.set("Access-Control-Allow-Credentials", "true");

    // Return the proxied response
    return new Response(fetchRes.body, {
        status: fetchRes.status,
        headers: headers,
    });
};

await serve(handler, { port });
