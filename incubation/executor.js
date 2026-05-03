const fs = require('fs');

function buildFetchRequest(ir, defaultScheme = 'https') {
    if (ir['schema-version'] !== '1.0') {
        console.warn('Warning: Unsupported schema version or missing version.');
    }

    let scheme = defaultScheme;
    let host = '';

    const headers = new Headers();

    for (const header of ir.headers || []) {
        const name = header.name;
        const value = String(header.value);

        if (name.toLowerCase() === ':scheme') {
            scheme = value;
        } else if (name.toLowerCase() === 'host') {
            host = value;
            headers.append(name, value);
        } else {
            headers.append(name, value);
        }
    }

    if (!host) {
        throw new Error('Host header is missing from the IR payload.');
    }

    const url = `${scheme}://${host}${ir.uri}`;

    let body = undefined;
    if (ir.body) {
        switch (ir.body.type) {
            case 'text':
                body = ir.body.content;
                break;
            case 'base64':
                body = Buffer.from(ir.body.content, 'base64');
                break;
            case 'binary_stream':
                body = fs.readFileSync(ir.body.content);
                break;
            default:
                throw new Error(`Unsupported body type: ${ir.body.type}`);
        }
    }

    const fetchOptions = {
        method: ir.method,
        headers: headers,
    };

    if (body !== undefined) {
        fetchOptions.body = body;
    }

    return { url, fetchOptions };
}

async function main() {
    if (process.argv.length < 3) {
        console.error('Usage: node executor.js <path-to-httpr-ir.json>');
        process.exit(1);
    }

    const payloadPath = process.argv[2];

    try {
        const payloadData = fs.readFileSync(payloadPath, 'utf-8');
        const ir = JSON.parse(payloadData);

        const { url, fetchOptions } = buildFetchRequest(ir);

        console.log(`Executing ${ir.method} request to ${url}...`);

        const response = await fetch(url, fetchOptions);

        console.log(`\nResponse Status: ${response.status} ${response.statusText}`);
        console.log('Response Headers:');
        response.headers.forEach((value, key) => {
            console.log(`  ${key}: ${value}`);
        });

        const responseText = await response.text();
        console.log('\nResponse Body:');
        console.log(responseText);

    } catch (err) {
        console.error('Execution error:', err.message);
        process.exit(1);
    }
}

// Export the build function so it can be required as an API module
module.exports = {
    buildFetchRequest
};

// If run directly from the command line, execute the main function
if (require.main === module) {
    main();
}