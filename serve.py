#!/usr/bin/env python3
"""
Custom HTTP Server with 404 handling for testing scotchinfo website locally
"""

import http.server
import socketserver
import os
import sys

PORT = 8000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler that serves 404.html for missing files"""
    
    def do_GET(self):
        # Remove query parameters
        path = self.path.split('?')[0]
        
        # Check if file exists (skip root)
        if path != '/' and not os.path.exists(path.lstrip('/')):
            # Serve custom 404 page
            self.path = '/404.html'
        
        return super().do_GET()
    
    def end_headers(self):
        # Add CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def main():
    # Change to script directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print("=" * 60)
        print("🚀 scotchinfo Local Development Server")
        print("=" * 60)
        print(f"✅ Server running at: http://localhost:{PORT}")
        print(f"📁 Serving files from: {os.getcwd()}")
        print(f"📄 Custom 404 page: ENABLED")
        print("")
        print("Quick Links:")
        print(f"  🏠 Home:      http://localhost:{PORT}/")
        print(f"  📊 Dashboard: http://localhost:{PORT}/dashboard/")
        print(f"  👥 Committee: http://localhost:{PORT}/committee.html")
        print(f"  ❌ Test 404:  http://localhost:{PORT}/nonexistent-page")
        print("")
        print("Press Ctrl+C to stop the server")
        print("=" * 60)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 Server stopped. Goodbye!")
            sys.exit(0)

if __name__ == "__main__":
    main()
