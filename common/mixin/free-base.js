	import $Time from '@/common/utils/time.js'
	
	export default {
		filters:{
			formatTime(date){
				return $Time.gettime(date)
			}
		}
	}