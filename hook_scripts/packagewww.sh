

filepath=$(cd "$(dirname "$0")"; pwd)

ant -f "${filepath}/build.xml" pkgwww_ios 
