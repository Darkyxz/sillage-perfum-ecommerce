import { file } from "bun";
import { join } from "path";

const PORT = process.env.PORT || 3000;

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    let filePath = url.pathname;
    
    // Servir archivos estáticos desde la carpeta dist
    if (filePath === "/" || filePath === "/index.html") {
      filePath = "/index.html";
    }
    
    // Si no tiene extensión, probablemente sea una ruta de React Router
    if (!filePath.includes(".") && filePath !== "/") {
      filePath = "/index.html";
    }
    
    try {
      const staticFile = file(join(import.meta.dir, "dist", filePath));
      
      if (await staticFile.exists()) {
        return new Response(staticFile);
      } else {
        // Fallback a index.html para React Router
        const indexFile = file(join(import.meta.dir, "dist", "index.html"));
        return new Response(indexFile, {
          headers: { "Content-Type": "text/html" }
        });
      }
    } catch (error) {
      console.error("Error serving file:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
});

console.log(`🚀 Server running on http://localhost:${PORT}`);
