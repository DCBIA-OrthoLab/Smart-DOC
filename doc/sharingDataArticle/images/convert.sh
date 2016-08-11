dir=$1
for files in $(ls $dir/*.png)
do
	outname=$(basename ${files%%.png}Out.eps)
	convert $files $outname
done