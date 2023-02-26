
let p1moves = 0;
let p1matches = 0;

let p2moves = 0;
let p2matches = 0;

let turn = 1;

let open_cards = 0;
let game = [];

///////////////////////////////////////////////////////////////////////////////////////////////////

// function gets 'N'x'M' matrix index and maps it to our game array

function get_index(nxm)
{
	let x = parseInt((nxm[0]-1)*5) + parseInt(nxm[2]-1);
	if(x<30)
		return x;
	
	return -1;
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function restart_game()
{
	document.location.reload();
}


///////////////////////////////////////////////////////////////////////////////////////////////////

function start_game()
{

	//	get all hidden cards
	let btns = $(".card_hide").toArray();
		
	// 	initialize game array
	//	game = [ NxM, status, img_src  ]
	btns.forEach( (item,index)=>{
								game[index] = [ "id="+item.id, "status=hide", "0" ];
								}
				);
	
	// go through card images
	for(let img_name = 1; img_name<16; img_name++)
	{
		
		let index = Math.floor(Math.random() * 29) ;
		
		//	place first card randomly
		while(game[index][2] !== "0")
		{
			index = Math.floor(Math.random() * 29) ;
		}
		if(game[index][2] === "0")
			game[index][2] = "pix/"+img_name+".jpg";
	}
	
	
	//	place second card
	img_name = 1;
	game.forEach( (item, i)=>{
								if(game[i][2] === "0")
								{
									game[i][2] = "pix/"+img_name+".jpg";
									img_name++;
								}
	});
	
	console.log("starting game");
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function close_cards()
{
	//	get indexes of cards
	let first = get_index($(".card_show1").attr('id'));
	let second = get_index($(".card_show2").attr('id'));
	
	//	change status in game array
	game[first][1] = "status=hide" ;
	game[second][1] = "status=hide" ;
	
	//	change css property
	$(".card_show1").css("background-image","");
	$(".card_show2").css("background-image","");
	
	//	change html class
	$(".card_show1").toggleClass('card_show1 card_hide');
	$(".card_show2").toggleClass('card_show2 card_hide');
	
}

///////////////////////////////////////////////////////////////////////////////////////////////////


function reveal_card(clicked)
{
	//	get index of clicked card
	let index = get_index(this.id);
	
	//	check if card is already revealed
	if(game[index][1]==="status=finish" )
	{
		
		return 0;
	}
	
	if(game[index][1]==="status=show" )
	{
		
		return 0;
	}
	
	else
	{
		//	keep track of open cards
		open_cards++;
		
		//	update number of moves
		if(turn==1)
			$("#p1moves").html(p1moves);
		if(turn==2)
			$("#p2moves").html(p2moves);
		
		console.log(turn);
		
		
		
		if(open_cards==1 || open_cards==3)
		{	
			//	on third go, close cards
			if(open_cards==3)
			{
				close_cards();
				open_cards = 1;
			}

			// update game array
			game[index][1] = "status=show";

			//	change html class
			$("#"+this.id).toggleClass('card_hide card_show1');
			
			//	inject to css the right image
			let img_url = 'url('+'"'+game[index][2]+'"'+")";
			$(".card_show1").css("background-image", img_url);
			$(".card_show1").css("background-size", "cover");
			
			//	keep track of moves
			if(turn==1)
				p1moves++;
			if(turn==2)
				p2moves++;
		}
		
		//	second go
		if(open_cards==2)
		{
			//	update game array
			game[index][1] = "status=show";

			//	change html class
			$("#"+this.id).toggleClass('card_hide card_show2');
			
			//	inject to css the right image
			let img_url = 'url('+'"'+game[index][2]+'"'+")";
			$(".card_show2").css("background-image", img_url);
			$(".card_show2").css("background-size", "cover");
			
			//	check if second card matches first one
			let first = $(".card_show1").css("background-image");
			let second = $(".card_show2").css("background-image");			
			if(first==second)
			{
				//	update matches
				if(turn==1)
				{
					p1matches++;
					$("#p1matches").html(p1matches);
				}
				if(turn==2)
				{
					p2matches++;
					$("#p2matches").html(p2matches);
				}
				
				//	make new class tag for css
				let new_class = "f"+ parseInt(p1matches)+parseInt(p2matches);
				
				//	get indexes
				let first_index = $(".card_show1").attr('id');
				let second_index = $(".card_show2").attr('id');
				
				//	write new css code
				let new_css = "."+new_class;
				new_css+= `{
				width:140px;
				height:85px;
				border-width:4px;
				color:#196BCA;
				border-color:#18ab29;
				border-top-left-radius:12px;
				border-top-right-radius:12px;
				border-bottom-left-radius:12px;
				border-bottom-right-radius:12px;
				margin: 4px 2px;
				background-image:url("`
				new_css+= img_url+'");\n}\n'
				
				// inject css
				let cssSheet = document.createElement("style");
				cssSheet.innerText = new_css;
				document.head.appendChild(cssSheet)
				
				//	update cards with newly created class
				$(".card_show1").toggleClass('card_show1 '+new_class);
				$(".card_show2").toggleClass('card_show2 '+new_class);
				console.log(img_url);
				
				//	update game status
				game[get_index(first_index)][1]="status=finish";
				game[index][1] = "status=finish";
				
				//	start counting again
				open_cards = 0;
				
				//	CONGRATULATIONS YOU WIN
				if(p1matches+p2matches==15)
				{
					if(p1matches>p2matches)
						alert("PLAYER 1 WINS");
					else
						alert("PLAYER 2  WINS");
				}
				
				
				
			}
			else
			{
			
				if(turn==1)
				{
					$("#p1").toggleClass('turn no_turn');
					$("#p2").toggleClass('no_turn turn');
					turn=2;
				}
				else if(turn==2)
				{
					$("#p2").toggleClass('turn no_turn');
					$("#p1").toggleClass('no_turn turn');
					turn=1;
				}
			}
			
			
			
		}
	}
}
///////////////////////////////////////////////////////////////////////////////////////////////////

let loadPage = function()
{
	$(".new_game").click(restart_game);
	$(".card_hide").click(reveal_card);
	
	
	start_game();
	
}	

///////////////////////////////////////////////////////////////////////////////////////////////////

$("document").ready(loadPage);
