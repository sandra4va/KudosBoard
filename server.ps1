param(
  [int]$Port = 3000,
  [string]$Path = $PSScriptRoot
)

if (-not $Path) { $Path = (Get-Location).Path }

$listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback, $Port)
$listener.Start()

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   KudosBoard Local Server Running on http://localhost:$Port/" -ForegroundColor Green
Write-Host "   Serving static files from: $Path" -ForegroundColor Yellow
Write-Host "   Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan

try {
  while ($true) {
    $client = $listener.AcceptTcpClient()
    $stream = $client.GetStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $writer = New-Object System.IO.BinaryWriter($stream)

    $requestLine = $reader.ReadLine()
    if ($requestLine) {
      $parts = $requestLine.Split(" ")
      $urlPath = if ($parts.Length -gt 1) { $parts[1] } else { "/" }
      if ($urlPath -eq "/" -or $urlPath -eq "") { $urlPath = "/index.html" }
      $cleanPath = $urlPath.Split("?")[0].Split("#")[0].TrimStart('/').Replace('/', '\')
      $filePath = Join-Path $Path $cleanPath

      if (Test-Path $filePath -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $contentType = switch ($ext) {
          ".html" { "text/html; charset=utf-8" }
          ".js"   { "application/javascript; charset=utf-8" }
          ".mjs"  { "application/javascript; charset=utf-8" }
          ".css"  { "text/css; charset=utf-8" }
          ".json" { "application/json; charset=utf-8" }
          ".png"  { "image/png" }
          ".jpg"  { "image/jpeg" }
          ".jpeg" { "image/jpeg" }
          ".svg"  { "image/svg+xml" }
          ".ico"  { "image/x-icon" }
          default { "application/octet-stream" }
        }

        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $header = "HTTP/1.1 200 OK`r`nContent-Type: $contentType`r`nContent-Length: $($bytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
        $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
        $writer.Write($headerBytes)
        $writer.Write($bytes)
      } else {
        $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
        $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain`r`nContent-Length: $($msg.Length)`r`nConnection: close`r`n`r`n"
        $writer.Write([System.Text.Encoding]::ASCII.GetBytes($header))
        $writer.Write($msg)
      }
    }
    $writer.Flush()
    $client.Close()
  }
}
finally {
  $listener.Stop()
}
