# One-off: crop each sauce photo to a square around the white plate, 800px JPEG.
# Usage: powershell -File scripts/crop-plates.ps1 <srcDir> <outDir>
param([string]$src, [string]$out)
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System; using System.Drawing;
public static class Plate {
  // bbox of bright (plate) pixels, sampled every 4px
  public static int[] Box(Bitmap b) {
    int x0=b.Width, y0=b.Height, x1=0, y1=0;
    for (int y=0; y<b.Height; y+=4) for (int x=0; x<b.Width; x+=4) {
      Color c=b.GetPixel(x,y);
      if (c.R>215 && c.G>215 && c.B>205) { if(x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y; }
    }
    return new int[]{x0,y0,x1,y1};
  }
}
"@
New-Item -ItemType Directory -Force $out | Out-Null
foreach ($n in 'mushroom.jpg','rose.jpg','tomato.png','lemon.png','pesto.jpg') {
  $img = New-Object System.Drawing.Bitmap (Join-Path $src $n)
  $b = [Plate]::Box($img)
  $cx = ($b[0]+$b[2])/2; $cy = ($b[1]+$b[3])/2
  $s = [Math]::Min([Math]::Max($b[2]-$b[0], $b[3]-$b[1]), [Math]::Min($img.Width, $img.Height))
  $x = [int][Math]::Max(0, [Math]::Min($img.Width-$s, $cx-$s/2))
  $y = [int][Math]::Max(0, [Math]::Min($img.Height-$s, $cy-$s/2))
  $dst = New-Object System.Drawing.Bitmap 800, 800
  $g = [System.Drawing.Graphics]::FromImage($dst)
  $g.InterpolationMode = 'HighQualityBicubic'
  $g.DrawImage($img, (New-Object System.Drawing.Rectangle 0,0,800,800), (New-Object System.Drawing.Rectangle $x,$y,$s,$s), 'Pixel')
  $enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
  $p = New-Object System.Drawing.Imaging.EncoderParameters 1
  $p.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 82L
  $dst.Save((Join-Path $out ([IO.Path]::GetFileNameWithoutExtension($n) + '.jpg')), $enc, $p)
  "$n box=$($b -join ',') crop=$x,$y,$s"
  $g.Dispose(); $dst.Dispose(); $img.Dispose()
}
