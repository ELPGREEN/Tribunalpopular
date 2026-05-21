# Push casos.json to Vercel Edge Config
# Uso: ./scripts/push-edge-config.ps1
# Requer: Vercel CLI instalado (npm i -g vercel) e logado (vercel login)

param(
    [string]$EdgeConfigId = "ecfg_x1h9u4kssiyisxnsijtqdhdbfpbz",
    [string]$CasosFile = "game/casos.json"
)

Write-Host "📦 Enviando casos.json para Edge Config..." -ForegroundColor Cyan

if (-not (Test-Path $CasosFile)) {
    Write-Host "❌ Arquivo $CasosFile não encontrado!" -ForegroundColor Red
    exit 1
}

$casos = Get-Content $CasosFile -Raw | ConvertFrom-Json
Write-Host "📊 $($casos.Count) casos carregados" -ForegroundColor Green

# Usa Vercel CLI para atualizar Edge Config
try {
    # Converte para JSON compacto e escapa para shell
    $jsonContent = Get-Content $CasosFile -Raw
    $tempFile = [System.IO.Path]::GetTempFileName()
    $jsonContent | Set-Content $tempFile -Encoding UTF8
    
    $env:EDGE_CONFIG = $EdgeConfigId
    
    Write-Host "🚀 Executando: vercel edge-config add casos..." -ForegroundColor Yellow
    
    # Usa stdin redirect para passar o JSON
    $result = Get-Content $tempFile -Raw | vercel edge-config add casos --json 2>&1
    
    Remove-Item $tempFile -Force
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Edge Config atualizado com sucesso!" -ForegroundColor Green
        Write-Host "   ID: $EdgeConfigId" -ForegroundColor Gray
        Write-Host "   Chave: casos" -ForegroundColor Gray
    } else {
        Write-Host "❌ Falha ao atualizar Edge Config" -ForegroundColor Red
        Write-Host "   $result" -ForegroundColor Red
        Write-Host ""
        Write-Host "💡 Alternativa manual:" -ForegroundColor Yellow
        Write-Host "   1. Acesse https://vercel.com/dashboard/edge-config/$EdgeConfigId" -ForegroundColor Gray
        Write-Host "   2. Adicione a chave 'casos' com o conteúdo de game/casos.json" -ForegroundColor Gray
        Write-Host "   3. Ou use: vercel edge-config add casos < game/casos.json" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Erro: $_" -ForegroundColor Red
}
